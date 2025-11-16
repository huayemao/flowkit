import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Button } from './button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

interface WebFAQProps {
  faqData: Array<{
    question: string;
    answer: string;
  }>;
}

export const WebFAQ: React.FC<WebFAQProps> = ({ faqData }) => {
  const { t } = useTranslation();

  if (faqData.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('webFAQ.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('webFAQ.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <Collapsible key={index} className="group">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-200 hover:shadow-lg">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 dark:hover:bg-gray-700/50 h-auto"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100 pr-4 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-6 pb-4">
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('webFAQ.stillHaveQuestions')}
        </p>
        <a
          href="https://www.utities.online/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {t('webFAQ.contactUs')}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};