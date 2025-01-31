import { CryptoProxy } from '@proton/crypto';
import isTruthy from '@proton/utils/isTruthy';
import noop from '@proton/utils/noop';

import { DecryptedAddressKey, KeyPair, KeysPair, User, AddressKey as tsAddressKey, Key as tsKey } from '../interfaces';
import { getAddressKeyToken } from './addressKeys';
import { getDecryptedOrganizationKey } from './getDecryptedOrganizationKey';
import { splitKeys } from './keys';
import { decryptMemberToken } from './memberToken';

const getAddressKeyPassword = (
    { Activation, Token, Signature }: tsKey,
    userKeys: KeysPair,
    keyPassword: string,
    organizationKey?: KeyPair
) => {
    // If not decrypting the non-private member keys with the organization key, and
    // because the activation process is asynchronous in the background, allow the
    // private key to get decrypted already here so that it can be used
    if (!organizationKey && Activation) {
        return decryptMemberToken(Activation, userKeys.privateKeys, userKeys.publicKeys);
    }

    if (Token) {
        return getAddressKeyToken({
            Token,
            Signature,
            organizationKey,
            privateKeys: userKeys.privateKeys,
            publicKeys: userKeys.publicKeys,
        });
    }

    return Promise.resolve(keyPassword);
};

const getDecryptedAddressKey = async ({ ID, PrivateKey, Flags, Primary }: tsAddressKey, addressKeyPassword: string) => {
    const privateKey = await CryptoProxy.importPrivateKey({ armoredKey: PrivateKey, passphrase: addressKeyPassword });
    const publicKey = await CryptoProxy.importPublicKey({
        binaryKey: await CryptoProxy.exportPublicKey({ key: privateKey, format: 'binary' }),
    });
    return {
        ID,
        Flags,
        privateKey,
        publicKey,
        Primary,
    };
};

export const getDecryptedAddressKeys = async (
    addressKeys: tsAddressKey[] = [],
    userKeys: KeyPair[] = [],
    keyPassword: string,
    organizationKey?: KeyPair
): Promise<DecryptedAddressKey[]> => {
    if (!addressKeys.length || !userKeys.length) {
        return [];
    }

    const userKeysPair = splitKeys(userKeys);

    const [primaryKey, ...restKeys] = addressKeys;

    const primaryKeyResult = await getAddressKeyPassword(primaryKey, userKeysPair, keyPassword, organizationKey)
        .then((password) => getDecryptedAddressKey(primaryKey, password))
        .catch(noop);

    // In case the primary key fails to decrypt, something is broken, so don't even try to decrypt the rest of the keys.
    if (!primaryKeyResult) {
        return [];
    }

    const restKeyResults = await Promise.all(
        restKeys.map((restKey) => {
            return getAddressKeyPassword(restKey, userKeysPair, keyPassword, organizationKey)
                .then((password) => getDecryptedAddressKey(restKey, password))
                .catch(noop);
        })
    );

    return [primaryKeyResult, ...restKeyResults].filter(isTruthy);
};
export const getDecryptedAddressKeysHelper = async (
    addressKeys: tsAddressKey[] = [],
    user: User,
    userKeys: KeyPair[] = [],
    keyPassword: string
): Promise<DecryptedAddressKey[]> => {
    if (!user.OrganizationPrivateKey) {
        return getDecryptedAddressKeys(addressKeys, userKeys, keyPassword);
    }

    const { OrganizationPrivateKey } = user;

    const organizationKey = OrganizationPrivateKey
        ? await getDecryptedOrganizationKey(OrganizationPrivateKey, keyPassword).catch(noop)
        : undefined;
    // When signed into a non-private member, if the organization key can't be decrypted, the rest
    // of the keys won't be able to get decrypted
    if (!organizationKey) {
        return [];
    }
    return getDecryptedAddressKeys(addressKeys, userKeys, keyPassword, organizationKey);
};
