import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';
import { IndustryOption, CompanySizeOption } from '@/types/list/ListOptions';

export async function getIndustryOptions(): Promise<IndustryOption[]> {
  const query = groq`*[_type == "list_industry" && is_active == true] | order(order asc) {
    _id,
    value,
    label {
      en,
      id
    },
    order,
    is_active,
    description
  }`;

  try {
    const result = await client.fetch(query, {}, { cache: 'no-store' });
    return result || [];
  } catch (error) {
    console.error('Error fetching industry options:', error);
    return [];
  }
}

export async function getCompanySizeOptions(): Promise<CompanySizeOption[]> {
  const query = groq`*[_type == "list_company_size" && is_active == true] | order(order asc) {
    _id,
    value,
    label {
      en,
      id
    },
    order,
    is_active,
    description
  }`;

  try {
    const result = await client.fetch(query, {}, { cache: 'no-store' });
    return result || [];
  } catch (error) {
    console.error('Error fetching company size options:', error);
    return [];
  }
}