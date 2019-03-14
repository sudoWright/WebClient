export const INFO_RESPONSE = {
    Version: 4,
    '2FA': {
        TOTP: 1,
        U2F: null
    }
};

export const INFO_RESPONSE_NO_2FA = {
    Version: 4,
    '2FA': {
        TOTP: 0,
        U2F: null
    }
};

export const AUTH_RESPONSE_NO_UNLOCK = {
    AccessToken:
        '-----BEGIN PGP MESSAGE-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\nwcBMA2FXf81lb6cOAQf/f6d898mJqKsWJEngKonHGIXRF9Esz8kJ1KdVelYU\nlrVWrh3jGKvpRoMEkUmeexA5EPAOQOm/eFwSeF7YjG4uQm8M29/YnBlGzTHV\nKZOjC+RergHYMgB9G+vSI6D4I/mc0Ufs38Tq13JXZJ01sBkH7vqSO7KQurp/\nBtdSbJloEiDXpvL/IqncYb0JpTJ1v6ip4zmZ1m4gVm7+rSdTfacloHaqW0QU\nkkfe/tS6SbIqPNzNC9bP1ZJNrN60PoMQA0LKx5sI8D+NTSU0s3FZw+U9dn9l\n2GefcVcSKoMuETpX7JwPRnGTTwiVvEkFsCCwUwVlADNcTAmX4hiESg/tgtjo\nyNJgATfg9Zom+NnhcNgTKyGxy7xrJPJbAWmYqPwsP5n7I2J+8/1gpZKnZLWb\njN7XQ/JXDgKJQEW1UUrddYaYQVn75na1UYP6WfIS/idUXOMB7OtTNP/w6/ML\n938l84g6dN5e\n=RKtB\n-----END PGP MESSAGE-----\n',
    UID: '95c0ea8d92f759c13c2a17d3921daa75e761ce92',
    PasswordMode: 1,
    '2FA': {
        TOTP: 1,
        U2F: null
    },
    PrivateKey:
        '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\n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\n=aLGy\n-----END PGP PRIVATE KEY BLOCK-----\n',
    EncPrivateKey:
        '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\n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\n=aLGy\n-----END PGP PRIVATE KEY BLOCK-----\n',
    KeySalt: 'P1ep8VKlNMgMblolFu+F7Q==',
    ServerProof: 'server-proof'
};

export const AUTH_RESPONSE = {
    AccessToken:
        '-----BEGIN PGP MESSAGE-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\nwcBMA2FXf81lb6cOAQf/f6d898mJqKsWJEngKonHGIXRF9Esz8kJ1KdVelYU\nlrVWrh3jGKvpRoMEkUmeexA5EPAOQOm/eFwSeF7YjG4uQm8M29/YnBlGzTHV\nKZOjC+RergHYMgB9G+vSI6D4I/mc0Ufs38Tq13JXZJ01sBkH7vqSO7KQurp/\nBtdSbJloEiDXpvL/IqncYb0JpTJ1v6ip4zmZ1m4gVm7+rSdTfacloHaqW0QU\nkkfe/tS6SbIqPNzNC9bP1ZJNrN60PoMQA0LKx5sI8D+NTSU0s3FZw+U9dn9l\n2GefcVcSKoMuETpX7JwPRnGTTwiVvEkFsCCwUwVlADNcTAmX4hiESg/tgtjo\nyNJgATfg9Zom+NnhcNgTKyGxy7xrJPJbAWmYqPwsP5n7I2J+8/1gpZKnZLWb\njN7XQ/JXDgKJQEW1UUrddYaYQVn75na1UYP6WfIS/idUXOMB7OtTNP/w6/ML\n938l84g6dN5e\n=RKtB\n-----END PGP MESSAGE-----\n',
    UID: '95c0ea8d92f759c13c2a17d3921daa75e761ce92',
    PasswordMode: 2,
    '2FA': {
        TOTP: 1,
        U2F: null
    },
    PrivateKey:
        '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\n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\n=aLGy\n-----END PGP PRIVATE KEY BLOCK-----\n',
    EncPrivateKey:
        '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\n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\n=aLGy\n-----END PGP PRIVATE KEY BLOCK-----\n',
    KeySalt: 'P1ep8VKlNMgMblolFu+F7Q==',
    ServerProof: 'server-proof'
};

export const AUTH_RESPONSE_CLEARTEXT = {
    AccessToken: '123',
    UID: '95c0ea8d92f759c13c2a17d3921daa75e761ce92',
    PasswordMode: 2,
    '2FA': {
        TOTP: 1,
        U2F: null
    },
    ServerProof: 'server-proof'
};

export const COOKIE_RESPONSE = {};

export const USER_RESPONSE = {
    User: {
        Keys: [
            {
                ID: '6T3seNEkkEFpQIiSQw5SUNrzoeUDOzbcf9_Hm6g1CRnzSsXBfU2kIM8DlAq8ffl5l-go8VM5fBjhglJlRsqqeQ==',
                PrivateKey:
                    '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\n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\n=aLGy\n-----END PGP PRIVATE KEY BLOCK-----\n'
            },
            {
                ID: 'ZtxF90vTPmN7sZO1G7wHoVcJWRu1BLFS_J2sYKpw-2xew8Ld0qIS0TjddC83v5QQWuUYmpk73R3pEQA4mEoSDA==',
                PrivateKey:
                    '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\n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\n/P72/yFGChFiW0zc2F1SvaQYRToNLKFZVGYSGw==\n=CBJG\n-----END PGP PRIVATE KEY BLOCK-----\n'
            }
        ]
    }
};

export const USER_RESPONSE_NO_KEYS = {
    User: {
        Keys: []
    }
};

export const SALT_RESPONSE = {
    KeySalts: [
        {
            ID: '6T3seNEkkEFpQIiSQw5SUNrzoeUDOzbcf9_Hm6g1CRnzSsXBfU2kIM8DlAq8ffl5l-go8VM5fBjhglJlRsqqeQ==',
            KeySalt: 'P1ep8VKlNMgMblolFu+F7Q=='
        },
        {
            ID: 'ZtxF90vTPmN7sZO1G7wHoVcJWRu1BLFS_J2sYKpw-2xew8Ld0qIS0TjddC83v5QQWuUYmpk73R3pEQA4mEoSDA==',
            KeySalt: 'MDRDvBUu1bKtKyG3/v5BXw=='
        },
        {
            ID: 'cLKeYpv7gDHugAfXyRKZtw3mO2p2-wh7gK0LzMZ3YEuuyCUkyXAiFwzqafHyTdfRmkomgeAfL3AIxnSlizUxnQ==',
            KeySalt: 'MDRDvBUu1bKtKyG3/v5BXw=='
        },
        {
            ID: '8AoGzP-L1ZDAG-k2L96iHi6wZaA1voC8O8mL5dDigjWDaXyL0vn8xlLxnArS6b3WiAUDKNrV_ggV97fxUiPS3g==',
            KeySalt: 'MDRDvBUu1bKtKyG3/v5BXw=='
        },
        {
            ID: 'LZf3JB-AHweqjyMgBDvKnLC7FoZcO0Qlz5-eMLlEuiA6epFioyddjNaEHLPAh39SyAcdeGDuUraxvBpSWHFD5A==',
            KeySalt: 'P1ep8VKlNMgMblolFu+F7Q=='
        }
    ]
};
