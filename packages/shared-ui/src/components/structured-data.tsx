import React from 'react';

interface StructuredDataProps {
  toolName: string;
  toolDescription: string;
  faqData?: Array<{
    question: string;
    answer: string;
  }>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ 
  toolName, 
  toolDescription, 
  faqData = [] 
}) => {
  // 基础的WebApplication结构化数据
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolName,
    "description": toolDescription,
    "url": typeof window !== 'undefined' ? window.location.href : "https://utities.online",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "FlowKit",
      "url": "https://utities.online"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FlowKit",
      "url": "https://utities.online"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "zh-CN",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true
  };

  // FAQ结构化数据
  const faqSchema = faqData.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // BreadcrumbList结构化数据
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": "https://utities.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "工具",
        "item": "https://utities.online/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": toolName,
        "item": typeof window !== 'undefined' ? window.location.href : "https://utities.online"
      }
    ]
  };

  // Organization结构化数据
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FlowKit",
    "url": "https://utities.online",
    "logo": "https://utities.online/logo.png",
    "description": "提供强大的在线工具集合，提升工作效率",
    "sameAs": [
      "https://github.com/flowkit"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema, null, 2)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 2)
        }}
      />
      
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema, null, 2)
          }}
        />
      )}
    </>
  );
};