export interface ListOption {
    _id: string;
    value: string;
    label: {
        en: string;
        id: string;
    };
    order: number;
    is_active: boolean;
    description?: string;
}

export type IndustryOption = ListOption;
export type CompanySizeOption = ListOption;