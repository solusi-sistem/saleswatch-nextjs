"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CustomButton from "@/components/button/button";
import { SectionProps, FeaturesContent } from "@/types/section";
import { getSectionData } from "@/hooks/getSectionData";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import type { LangKey } from "@/types";

const CACHE_KEY = "features_cache";
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: FeaturesContent;
  timestamp: number;
}

export default function Features({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith("/id") ? "id" : "";

  const [content, setContent] = useState<FeaturesContent | null>(null);
  const [loading, setLoading] = useState(true);

  const webFeaturesRef = useRef<HTMLDivElement>(null);
  const mobileFeaturesRef = useRef<HTMLDivElement>(null);
  const suiteModulesRef = useRef<HTMLDivElement>(null);

  const getCachedData = (): FeaturesContent | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsedCache: CachedData = JSON.parse(cached);
      const now = Date.now();

      if (now - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache.data;
      } else {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const setCachedData = (data: FeaturesContent) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchContent() {
      if (!id) return;

      const cachedContent = getCachedData();
      if (cachedContent) {
        setContent(cachedContent);
        setLoading(false);
      }

      try {
        const sectionData = await getSectionData(id);
        if (sectionData?.features_content) {
          setContent(sectionData.features_content);
          setCachedData(sectionData.features_content);
        }
      } catch (error) {
        if (!content && cachedContent) {
          setContent(cachedContent);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const sectionData = await getSectionData(id);
        if (sectionData?.features_content) {
          const currentDataString = JSON.stringify(content);
          const newDataString = JSON.stringify(sectionData.features_content);

          if (currentDataString !== newDataString) {
            setContent(sectionData.features_content);
            setCachedData(sectionData.features_content);
          }
        }
      } catch (error) {}
    }, 30000);

    return () => clearInterval(interval);
  }, [id, content]);

  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInUp");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    if (webFeaturesRef.current) observer.observe(webFeaturesRef.current);
    if (mobileFeaturesRef.current) observer.observe(mobileFeaturesRef.current);
    if (suiteModulesRef.current) observer.observe(suiteModulesRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (
    !content ||
    !content.mobile_features ||
    content.mobile_features.length === 0
  ) {
    return null;
  }

  const fiturUtamaList = content.mobile_features.filter(
    (f) => f.type_features === "fiturUtama",
  );
  const fiturSuiteList = content.mobile_features.filter(
    (f) => f.type_features === "fiturSuite" || !f.type_features,
  );

  const logoText = content.logo_text || "";
  const logoImage = content.logo_features?.asset?.url;
  const logoTeksFeatures = content.logo_teks_features || "";
  const suiteText = content.suite_text || "";

  return (
    <div className="bg-[#f2f7ff]">
      <div className="container mx-auto py-10 xl:px-30">
        <div className="bg-[#061551] max-w-5xl rounded-4xl px-8 py-12 mx-4 md:mx-auto animate__animated animate__fadeIn">
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-0">
            {/* Saleswatch Section */}
            <div className="flex flex-col gap-4 justify-between items-start lg:items-start">
              <div className="flex items-center justify-center w-full">
                <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none text-center">
                  {logoText}
                </h5>
              </div>

              <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full">
                {fiturUtamaList.map((feature, index) => {
                  const btnText =
                    currentLang === "id"
                      ? feature.section_title_id || feature.section_title_en
                      : feature.section_title_en || feature.section_title_id;

                  return (
                    <CustomButton
                      key={index}
                      className="h-14 w-[203px] !text-[16px]"
                      onClick={() => scrollToSection(`feature-${index}`)}
                    >
                      {btnText}
                    </CustomButton>
                  );
                })}
              </div>
            </div>

            {/* Divider with Character Image */}
            <div className="hidden lg:flex items-end justify-center relative px-8 pb-[0px] -ms-7">
              <div className="w-[4px] bg-[#6587A8] h-[120px]"></div>
              {logoImage && (
                <Image
                  src={logoImage}
                  alt={logoTeksFeatures}
                  width={120}
                  height={120}
                  priority
                  className="rounded-full absolute -left-0 -top-3"
                />
              )}
            </div>

            {/* Saleswatch Suite Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-0 md:gap-3 lg:justify-start pl-0 lg:pl-[1.35rem]">
                <div className="flex flex-col justify-center items-center lg:items-start">
                  <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">
                    {logoTeksFeatures}
                  </h5>
                  <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">
                    {suiteText}
                  </h5>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center [@media(min-width:1200px)]:justify-start">
                {fiturSuiteList.flatMap((feature) =>
                  (feature.features_list || []).map((item, itemIndex) => {
                    const btnText =
                      currentLang === "id"
                        ? item.title?.id || item.title?.en
                        : item.title?.en || item.title?.id;

                    return (
                      <CustomButton
                        key={`suite-btn-${item._id}-${itemIndex}`}
                        className="h-14 min-w-[203px] !text-[16px]"
                        onClick={() => scrollToSection("suite-modules")}
                      >
                        {btnText}
                      </CustomButton>
                    );
                  }),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Render Fitur Utama Sections */}
        {fiturUtamaList.map((feature, index) => {
          const sectionTitle =
            currentLang === "id"
              ? feature.section_title_id || feature.section_title_en
              : feature.section_title_en || feature.section_title_id;
          const mobileIcon = feature.mobile_icon?.asset?.url;
          const featuresList = feature.features_list || [];

          return (
            <div
              key={`fitur-utama-${index}`}
              ref={index === 0 ? mobileFeaturesRef : null}
              id={`feature-${index}`}
              className="py-10 scroll-mt-32"
            >
              <div className="flex justify-center items-center gap-3">
                {mobileIcon && (
                  <Image
                    src={mobileIcon}
                    alt={sectionTitle}
                    width={30}
                    height={30}
                    priority
                    style={{ filter: "brightness(0)" }}
                  />
                )}
                <h3 className="text-[#061551] font-bold text-2xl md:text-4xl">
                  {sectionTitle}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 max-w-7xl mx-auto px-4">
                {featuresList.map((item) => {
                  const title =
                    currentLang === "id"
                      ? item.title?.id || item.title?.en
                      : item.title?.en || item.title?.id;
                  const description =
                    currentLang === "id"
                      ? item.description?.id || item.description?.en
                      : item.description?.en || item.description?.id;
                  const icon = item.icon?.asset?.url;

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col items-center text-center gap-3"
                    >
                      {icon && (
                        <Image
                          src={icon}
                          alt={title || ""}
                          width={80}
                          height={80}
                          priority
                          style={{ filter: "brightness(0)" }}
                        />
                      )}
                      <h5 className="text-[#6587A8] font-semibold text-lg md:text-2xl">
                        {title}
                      </h5>
                      <p className="text-base md:text-lg opacity-70">
                        {description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Render Suite Modules Sections */}
        {fiturSuiteList.map((feature, index) => {
          const sectionTitle =
            currentLang === "id"
              ? feature.section_title_id || feature.section_title_en
              : feature.section_title_en || feature.section_title_id;
          const mobileIcon = feature.mobile_icon?.asset?.url;
          const featuresList = feature.features_list || [];

          return (
            <div
              key={`fitur-suite-${index}`}
              ref={index === 0 ? suiteModulesRef : null}
              id="suite-modules"
              className="py-10 scroll-mt-32"
            >
              <div className="flex justify-center items-center gap-3">
                {mobileIcon && (
                  <Image
                    src={mobileIcon}
                    alt={sectionTitle}
                    width={40}
                    height={40}
                    priority
                    style={{ filter: "brightness(0)" }}
                  />
                )}
                <h3 className="text-[#061551] font-bold text-2xl md:text-4xl">
                  {sectionTitle}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 max-w-7xl mx-auto px-4">
                {featuresList.map((item) => {
                  const title =
                    currentLang === "id"
                      ? item.title?.id || item.title?.en
                      : item.title?.en || item.title?.id;
                  const description =
                    currentLang === "id"
                      ? item.description?.id || item.description?.en
                      : item.description?.en || item.description?.id;
                  const icon = item.icon?.asset?.url;

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col items-center text-center gap-3"
                    >
                      {icon && (
                        <Image
                          src={icon}
                          alt={title || ""}
                          width={80}
                          height={80}
                          priority
                          style={{ filter: "brightness(0)" }}
                        />
                      )}
                      <h5 className="text-[#6587A8] font-semibold text-lg md:text-2xl">
                        {title}
                      </h5>
                      <p className="text-base md:text-lg opacity-70">
                        {description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
