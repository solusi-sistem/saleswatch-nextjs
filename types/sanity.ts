import { PortableTextBlock } from "sanity";

export interface SanityDocument {
    _id: string;
    _rev: string;
    _createdAt: string;
    _updatedAt: string;
}

export interface SanityReference<Type extends SanityDocument> {
    _type: "reference";
    _ref: string;
    _weak?: boolean;
}

export interface SanityCrossDatasetReference extends SanityReference<never> {
    _dataset: string;
}

export interface SanityImage {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
}

export type ArrayMemberType<Member> = Member extends {
    _type: infer Type;
}
    ? Type
    : string;

export type ArrayMember<Member> = Member extends string | number | boolean
    ? Member
    : Member & {
        _key: string;
        _type: ArrayMemberType<Member>;
    };

export interface SanitySlug {
    _type: "slug";

    /**
     * The current value of the slug.
     */
    current: string;
}

export interface SanityGeopoint {
    _type: "geopoint";

    /**
     * Latitude
     */
    lat: number | null;

    /**
     * Longitude
     */
    lng: number | null;

    /**
     * Altitude
     */
    alt: number | null;
}

// export type PortableTextBlock = Record<string, unknown>

export interface Icon {
    name: string | null;
}

export interface LocaleString {
    en: string;
    id: string;
}

export interface LocaleText {
    en: string;
    id: string;
}

export interface LocaleContent {
    en: (
        | ArrayMember<PortableTextBlock>
        | ArrayMember<SanityImage>
        | ArrayMember<Youtube>
    )[];
    id: (
        | ArrayMember<PortableTextBlock>
        | ArrayMember<SanityImage>
        | ArrayMember<Youtube>
    )[];
}

export interface Header {
    logo: SanityImage;
    menu_list: ArrayMember<{
        label: LocaleString;
        link: string;
        dropdown_list:
        | ArrayMember<{
            label: LocaleString;
            slug: SanitySlug;
            link: string;
        }>[]
        | null;
    }>[];
    cta_button: {
        label: LocaleString;
        link: string;
    };
}

export interface Footer {
    logo: SanityImage;
    menu_list: ArrayMember<{
        label: LocaleString;
        link: string;
    }>[];
    copyright_text: LocaleString;
    contact_form: {
        background_image: SanityImage;
        title: LocaleString;
        description: LocaleText;
    };
    whatsapp_phone_number: number;
}

export interface Layout extends SanityDocument {
    _type: "layout";
    title: string;
    anniversary_button: boolean;
    header: Header;
    footer: Footer;
}

export interface Pages extends SanityDocument {
    _type: "pages";
    title: LocaleString;
    description: LocaleString;
    open_graph_image: SanityImage;
    page_name: string;
    anniversary_mode: boolean | null;
    anniversary_logo: SanityImage | null;
    anniversary_title: LocaleString | null;
    anniversary_description: LocaleText | null;
    anniversary_images: ArrayMember<SanityImage>[] | null;
    anniversary_video: string | null;
    opening_speech_title: LocaleString;
    opening_speech_description: LocaleText;
    opening_speech_background: SanityImage;
    gallery_title: LocaleString;
    gallery_description: LocaleString;
    celebratory_title: LocaleString;
    celebratory_background: SanityImage;
    celebratory_notes: ArrayMember<{
        photo: SanityImage;
        name: string;
        title: LocaleString;
        company_name: string;
        comment: LocaleText;
    }>[];
    content:
    | (
        | ArrayMember<HomeHero>
        | ArrayMember<HomeAbout>
        | ArrayMember<HomeBrands>
        | ArrayMember<HomeProduct>
        | ArrayMember<HomeSegment>
        | ArrayMember<HomeTkdn>
        | ArrayMember<HomeReview>
        | ArrayMember<HomeShare>
        | ArrayMember<ProductHero>
        | ArrayMember<CorporateAbout>
        | ArrayMember<CorporateValues>
        | ArrayMember<CorporateManagementProfile>
        | ArrayMember<CorporateMenu>
        | ArrayMember<CorporateAwards>
        | ArrayMember<CorporateShareholders>
        | ArrayMember<CorporateGovernance>
        | ArrayMember<CorporateOrganizationStructure>
        | ArrayMember<CorporateSocialResponsibility>
        | ArrayMember<InvestorProspectus>
        | ArrayMember<InvestorAnnualReport>
        | ArrayMember<InvestorFinancialInformation>
        | ArrayMember<InvestorGeneralMeeting>
        | ArrayMember<InvestorShareInformation>
        | ArrayMember<InvestorOtherInformation>
        | ArrayMember<CareerHero>
        | ArrayMember<CareerBusiness>
        | ArrayMember<ContactBranch>
    )[]
    | null;
}

export interface Products extends SanityDocument {
    _type: "products";
    icon: SanityImage;
    image: SanityImage;
    title: LocaleString;
    slug: SanitySlug;
    home_card_description: LocaleString;
    description: LocaleText;
    brands: Brands[];
}

export interface Segments extends SanityDocument {
    _type: "segments";
    title: LocaleString;
    slug: SanitySlug;
    icon: SanityImage;
    short_description: LocaleString;
    description: LocaleContent;
    case_study_list:
    | ArrayMember<{
        title: LocaleString;
        image: SanityImage | null;
        description: LocaleContent;
        gallery_list: ArrayMember<SanityImage>[] | null;
        brands: Brands[];
    }>[]
    | null;
    next_segment: SanityReference<Segments> | null;
}

export interface Tkdns extends SanityDocument {
    _type: "tkdns";
    icon: SanityImage;
    image: SanityImage;
    title: LocaleString;
    slug: SanitySlug;
    description: LocaleText;
    brands: Brands[] | null;
}

export interface Brands extends SanityDocument {
    _type: "brands";
    categories: ArrayMember<string>[] | null;
    image: SanityImage;
    link: string;
    name: string;
    slug: SanitySlug;
    short_description: LocaleString;
    description: LocaleContent;
    product_list:
    | ArrayMember<{
        inquiry_form: boolean | null;
        tkdn_and_bmp_percentage: number | null;
        image: SanityImage;
        title: LocaleString;
        slug: SanitySlug;
        short_description: LocaleText | null;
        long_description: LocaleContent;
        file: string | null;
        dont_include_this_product_in_product_offerings: boolean | null;
        specific_products_offerings: boolean | null;
        product_offerings_list: ArrayMember<string>[] | null;
        dont_include_this_product_in_segment_solutions: boolean | null;
        specific_segment_solutions: boolean | null;
        segment_solution_list: ArrayMember<string>[] | null;
    }>[]
    | null;
    inquiry_form: boolean | null;
    is_not_included_in_product_offerings: boolean | null;
    only_include_tkdn_products_in_product_offerings: boolean | null;
}

export interface NewsEvents extends SanityDocument {
    _type: "news_events";
    image: SanityImage;
    title: LocaleString;
    slug: SanitySlug;
    category: string;
    short_description: LocaleString;
    long_description: LocaleContent;
    tags: ArrayMember<string>[] | null;
    related_articles: NewsEvents[] | null;
}

export interface Jobs extends SanityDocument {
    _type: "jobs";
    name: string;
    slug: SanitySlug;
    department: string;
    time: string;
    location: string;
    summary: LocaleContent;
}

export interface Contacts extends SanityDocument {
    _type: "contacts";
    name: string;
    slug: SanitySlug;
    location: SanityGeopoint;
    address: string;
    maps_link: string;
    phone_list: ArrayMember<string>[];
    available_schedule: string;
    available_time: string;
}

export interface HomeHero {
    section_name: string;
    title: LocaleString;
    description: LocaleString;
    background_video: string;
    cta_button_1: {
        title: LocaleString;
        link: string;
    };
}

export interface HomeAbout {
    section_name: string;
    background_image: SanityImage;
    title: LocaleString;
    description: LocaleText;
    cta_button: {
        title: LocaleString;
        link: string;
    };
}

export interface HomeBrands {
    section_name: string;
    title: LocaleString;
    description: LocaleText;
}

export interface HomeProduct {
    section_name: string;
    title: LocaleString;
    description: LocaleText;
}

export interface HomeSegment {
    section_name: string;
    title: LocaleString;
    description: LocaleText;
    cta_button: {
        title: LocaleString;
        link: string;
    };
}

export interface HomeTkdn {
    section_name: string;
    title: LocaleString;
    description: LocaleText;
    background_image: SanityImage;
}

export interface HomeReview {
    section_name: string;
    title: LocaleString;
    description: LocaleText;
    review_list: ArrayMember<{
        name: string;
        job: string;
        brand_logo: SanityImage;
        brand_name: string;
        comment: LocaleText;
    }>[];
}

export interface HomeShare {
    section_name: string;
    title: LocaleString;
    description: LocaleText;
    background_image: SanityImage;
    box_image: SanityImage;
    cta_button: {
        title: LocaleString;
        link: string;
    };
}

export interface ProductHero {
    title: LocaleString;
    description: LocaleText;
}

export interface CorporateAbout {
    section_name: string | null;
    vision: LocaleString;
    title: LocaleString;
    description: LocaleText;
    pillar_list: ArrayMember<{
        icon: Icon;
        title: LocaleString;
        description: LocaleString;
    }>[];
}

export interface CorporateValues {
    section_name: string | null;
    title: LocaleString;
    image: SanityImage;
    our_mission: {
        image: SanityImage;
        title: LocaleString;
        description: LocaleContent;
    };
    our_business_model: {
        title: LocaleString;
        subtitle: LocaleString;
        description: LocaleContent;
        image: SanityImage;
    };
}

export interface CorporateManagementProfile {
    section_name: string | null;
    title: LocaleString;
    description: LocaleString;
    member_list: ArrayMember<{
        image: SanityImage;
        name: string;
        role: string;
        job: LocaleString;
        description: LocaleText;
    }>[];
}

export interface CorporateMenu {
    section_name: string | null;
    corporate_list:
    | ArrayMember<{
        image: SanityImage;
        title: LocaleString;
        link: string;
        description: LocaleString | null;
    }>[]
    | null;
}

export interface CorporateAwards {
    section_name: string | null;
    title: LocaleString;
    award_list: ArrayMember<{
        image: SanityImage;
        title: LocaleString;
        description: LocaleString | null;
    }>[];
}

export interface CorporateShareholders {
    section_name: string | null;
    title: LocaleString;
    images: ArrayMember<SanityImage>[];
}

export interface CorporateOrganizationStructure {
    section_name: string | null;
    title: LocaleString;
    background_image: SanityImage;
    content: LocaleContent;
}

export interface CorporateGovernance {
    section_name: string | null;
    title: LocaleString;
    corporate_secretary: {
        member_list: ArrayMember<{
            name: string;
            job: LocaleString;
            image: SanityImage;
            description: LocaleText;
        }>[];
        content: LocaleContent;
    };
    audit_committee: {
        member_list: ArrayMember<{
            name: string;
            job: LocaleString;
            image: SanityImage;
            description: LocaleText;
        }>[];
        content: LocaleContent;
    };
    internal_audit: {
        member_list: ArrayMember<{
            name: string;
            job: LocaleString;
            image: SanityImage;
            description: LocaleText;
        }>[];
        content: LocaleContent;
    };
    charter_documents: {
        title: LocaleString;
        document_list: ArrayMember<{
            title: LocaleString;
            slug: SanitySlug;
            background_image: SanityImage;
            subtitle: LocaleString | null;
            content: LocaleContent | null;
        }>[];
    };
}

export interface CorporateSocialResponsibility {
    section_name: string | null;
    title: LocaleString;
    background_image: SanityImage;
    content: LocaleContent;
}

export interface InvestorProspectus {
    section_name: string;
    title: LocaleString;
    prospectus_list: ArrayMember<{
        image: SanityImage;
        file: string;
        title: LocaleString;
        description: LocaleString;
    }>[];
}

export interface InvestorAnnualReport {
    section_name: string;
    title: LocaleString;
    annual_report_list: ArrayMember<{
        image: SanityImage;
        file: string;
        title: LocaleString;
        description: LocaleString;
    }>[];
}

export interface InvestorFinancialInformation {
    section_name: string;
    title: LocaleString;
    financial_highlight: string;
    financial_statement_list: ArrayMember<{
        year: string;
        statement_list: ArrayMember<{
            title: LocaleString;
            file: string;
        }>[];
    }>[];
}

export interface InvestorGeneralMeeting {
    section_name: string;
    title: LocaleString;
    description: LocaleString;
    general_meeting_list: ArrayMember<{
        year: string;
        description: LocaleString;
        date: string;
        content_list: ArrayMember<{
            title: LocaleString;
            file: string;
        }>[];
    }>[];
}

export interface InvestorShareInformation {
    section_name: string;
    title: LocaleString;
    description: LocaleString;
    background_image: SanityImage;
    navigation: {
        title: LocaleString;
        description: LocaleString;
        feature_list: ArrayMember<{
            title: LocaleString;
            subtitle: LocaleString;
        }>[];
        menu_list: ArrayMember<{
            title: LocaleString;
            description: LocaleString;
            background_image: SanityImage;
            link: string;
        }>[];
    };
}

export interface InvestorOtherInformation {
    section_name: string;
    title: LocaleString;
    background_image: SanityImage;
    content: LocaleContent;
    disclosure_of_information: ArrayMember<{
        file: string;
        name: LocaleString;
    }>[];
}

export interface CareerHero {
    section_name: string;
    title: LocaleString;
    description: LocaleString;
    background_image: SanityImage;
}

export interface CareerBusiness {
    section_name: string;
    title: LocaleString;
    description: LocaleString;
    business_list: ArrayMember<{
        image: SanityImage;
        title: LocaleString;
        description: LocaleString;
    }>[];
}

export interface ContactBranch {
    section_name: string;
    title: LocaleString;
    location: SanityGeopoint;
    address: string;
    phones: ArrayMember<string>[];
    available_schedule: string;
    available_time: string;
}

export interface Youtube {
    url: string | null;
}

export interface SanityAssetSourceData {
    name: string | null;
    id: string | null;
    url: string | null;
}

export interface SanityImageAsset extends SanityDocument {
    _type: "sanity.imageAsset";
    originalFilename: string | null;
    label: string | null;
    title: string | null;
    description: string | null;
    altText: string | null;
    sha1hash: string | null;
    extension: string | null;
    mimeType: string | null;
    size: number | null;
    assetId: string | null;
    uploadId: string | null;
    path: string | null;
    url: string | null;
    metadata: SanityImageMetadata | null;
    source: SanityAssetSourceData | null;
}

export interface SanityFileAsset extends SanityDocument {
    _type: "sanity.fileAsset";
    originalFilename: string | null;
    label: string | null;
    title: string | null;
    description: string | null;
    altText: string | null;
    sha1hash: string | null;
    extension: string | null;
    mimeType: string | null;
    size: number | null;
    assetId: string | null;
    uploadId: string | null;
    path: string | null;
    url: string | null;
    source: SanityAssetSourceData | null;
}

export interface SanityImageCrop {
    top: number | null;
    bottom: number | null;
    left: number | null;
    right: number | null;
}

export interface SanityImageHotspot {
    x: number | null;
    y: number | null;
    height: number | null;
    width: number | null;
}

export interface SanityImageMetadata {
    location: SanityGeopoint | null;
    dimensions: SanityImageDimensions | null;
    palette: SanityImagePalette | null;
    lqip: string | null;
    blurHash: string | null;
    hasAlpha: boolean | null;
    isOpaque: boolean | null;
}

export interface SanityImageDimensions {
    height: number | null;
    width: number | null;
    aspectRatio: number | null;
}

export interface SanityImagePalette {
    darkMuted: SanityImagePaletteSwatch | null;
    lightVibrant: SanityImagePaletteSwatch | null;
    darkVibrant: SanityImagePaletteSwatch | null;
    vibrant: SanityImagePaletteSwatch | null;
    dominant: SanityImagePaletteSwatch | null;
    lightMuted: SanityImagePaletteSwatch | null;
    muted: SanityImagePaletteSwatch | null;
}

export interface SanityImagePaletteSwatch {
    background: string | null;
    foreground: string | null;
    population: number | null;
    title: string | null;
}
