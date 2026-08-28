import type { MDXComponents } from 'mdx/types'
import React, { JSX } from 'react'
import { CodeBlock } from '@/components/code-block'

import { cn } from '@/lib/utils'



// 自定义链接组件
interface CustomLinkProps {
    href: string
    children: React.ReactNode
    className?: string
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, className }) => {
    const isExternal = href.startsWith('http')

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    'text-primary hover:text-primary/80 transition-colors',
                    className
                )}
            >
                {children}
            </a>
        )
    }

    return (
        <a
            href={href}
            className={cn('text-primary hover:text-primary/80 transition-colors', className)}
        >
            {children}
        </a>
    )
}

// 自定义标题组件
const CustomHeading: React.FC<{
    level: 1 | 2 | 3 | 4 | 5 | 6
    children: React.ReactNode
    className?: string
}> = ({ level, children, className }) => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
    const baseClasses = "font-bold tracking-tight"

    const sizeClasses = {
        1: "text-4xl mb-6 mt-12",
        2: "text-3xl mb-4 mt-10",
        3: "text-2xl mb-3 mt-8",
        4: "text-xl mb-2 mt-6",
        5: "text-lg mb-1 mt-4",
        6: "text-base mb-1 mt-3 font-semibold"
    }[level]

    return (
        <HeadingTag
            className={cn(baseClasses, sizeClasses, className)}
        >
            {children}
        </HeadingTag>
    )
}

// 自定义段落组件
const CustomParagraph: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <p className={cn('leading-relaxed mb-4', className)}>
            {children}
        </p>
    )
}

// 自定义列表组件
const CustomUl: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <ul className={cn('list-disc pl-6 mb-4 space-y-1', className)}>
            {children}
        </ul>
    )
}

const CustomOl: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <ol className={cn('list-decimal pl-6 mb-4 space-y-1', className)}>
            {children}
        </ol>
    )
}

// 自定义列表项组件
const CustomLi: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <li className={cn('leading-relaxed', className)}>
            {children}
        </li>
    )
}

// 自定义引用组件
const CustomBlockquote: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <blockquote className={cn(
            'border-l-4 border-primary pl-4 italic text-muted-foreground my-6',
            className
        )}>
            {children}
        </blockquote>
    )
}

// 自定义表格组件
const CustomTable: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <div className="w-full overflow-x-auto my-6">
            <table className={cn('w-full border-collapse', className)}>
                {children}
            </table>
        </div>
    )
}

const CustomThead: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <thead className={cn('bg-muted', className)}>
            {children}
        </thead>
    )
}

const CustomTbody: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <tbody className={className}>
            {children}
        </tbody>
    )
}

const CustomTr: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <tr className={cn('border-b border-border', className)}>
            {children}
        </tr>
    )
}

const CustomTh: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <th className={cn('px-4 py-2 text-left font-semibold', className)}>
            {children}
        </th>
    )
}

const CustomTd: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <td className={cn('px-4 py-2', className)}>
            {children}
        </td>
    )
}

const CustomPre: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => {
    return (
        <pre className={cn('overflow-x-auto', className)}>
            {children}
        </pre>
    )
}



// 导出MDX组件
const mdxComponents: MDXComponents = {
    code: (props) => {
        if (props.className && props.className?.includes('language-')) {
            return <CodeBlock {...props} />
        }
        return (
            <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm">
                {props.children}
            </code>
        )
    },
    a: CustomLink,
    h1: (props) => <CustomHeading level={1} {...props} />,
    h2: (props) => <CustomHeading level={2} {...props} />,
    h3: (props) => <CustomHeading level={3} {...props} />,
    h4: (props) => <CustomHeading level={4} {...props} />,
    h5: (props) => <CustomHeading level={5} {...props} />,
    h6: (props) => <CustomHeading level={6} {...props} />,
    p: CustomParagraph,
    ul: CustomUl,
    ol: CustomOl,
    li: CustomLi,
    blockquote: CustomBlockquote,
    table: CustomTable,
    thead: CustomThead,
    tbody: CustomTbody,
    tr: CustomTr,
    th: CustomTh,
    td: CustomTd,
    pre: CustomPre
}



export function useMDXComponents(): MDXComponents {
    return mdxComponents
}