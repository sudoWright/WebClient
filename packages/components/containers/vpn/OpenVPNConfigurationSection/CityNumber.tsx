import { c, msgid } from 'ttag';
import { VPNServer } from '@proton/shared/lib/interfaces/VPNServer';
import { uniqueBy } from '@proton/util/array';

interface Props {
    group: VPNServer[];
}

const CityNumber = ({ group }: Props) => {
    const number = uniqueBy(group, ({ City }) => City).length;
    return (
        <div className="inline-flex-vcenter">
            {c('Info').ngettext(msgid`${number} city`, `${number} cities`, number)}
        </div>
    );
};

export default CityNumber;
