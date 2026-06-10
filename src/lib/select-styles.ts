import type { GroupBase, StylesConfig } from 'react-select';

export function buildSelectStyles<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(
    isDark: boolean,
    compact = false,
): StylesConfig<Option, IsMulti, Group> {
    return {
        control: (base) => ({
            ...base,
            ...(isDark && { backgroundColor: '#27272a', borderColor: '#52525b' }),
            ...(compact && { minHeight: '30px', fontSize: '0.8rem' }),
        }),
        valueContainer: (base) => ({ ...base, ...(compact && { padding: '0 6px' }) }),
        dropdownIndicator: (base) => ({ ...base, ...(compact && { padding: '4px' }) }),
        clearIndicator: (base) => ({ ...base, ...(compact && { padding: '4px' }) }),
        menu: (base) => ({ ...base, ...(isDark && { backgroundColor: '#27272a' }) }),
        menuList: (base) => ({ ...base, ...(isDark && { backgroundColor: '#27272a' }) }),
        option: (base, { isFocused }) => ({
            ...base,
            ...(isDark && { backgroundColor: isFocused ? '#3f3f46' : '#27272a', color: 'white' }),
            ...(compact && { fontSize: '0.8rem' }),
        }),
        singleValue: (base) => ({ ...base, ...(isDark && { color: 'white' }) }),
        input: (base) => ({ ...base, ...(isDark && { color: 'white' }) }),
        placeholder: (base) => ({ ...base, ...(isDark && { color: '#a1a1aa' }) }),
    };
}
