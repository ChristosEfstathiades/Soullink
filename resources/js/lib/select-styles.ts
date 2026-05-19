import type { GroupBase, StylesConfig } from 'react-select';

export function buildSelectStyles<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(
    isDark: boolean,
): StylesConfig<Option, IsMulti, Group> {
    return {
        control: (base) => ({ ...base, ...(isDark && { backgroundColor: '#27272a', borderColor: '#52525b' }) }),
        menu: (base) => ({ ...base, ...(isDark && { backgroundColor: '#27272a' }) }),
        menuList: (base) => ({ ...base, ...(isDark && { backgroundColor: '#27272a' }) }),
        option: (base, { isFocused }) => ({
            ...base,
            ...(isDark && { backgroundColor: isFocused ? '#3f3f46' : '#27272a', color: 'white' }),
        }),
        singleValue: (base) => ({ ...base, ...(isDark && { color: 'white' }) }),
        input: (base) => ({ ...base, ...(isDark && { color: 'white' }) }),
        placeholder: (base) => ({ ...base, ...(isDark && { color: '#a1a1aa' }) }),
    };
}
