import { cn } from '../lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('text-foreground font-bold text-xl', className)}>
            <span className="text-green-600">We</span>
            <span className="text-blue-600">chi</span>
        </div>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('size-5 font-bold text-sm', className)}>
            <span className="text-green-600">W</span>
            <span className="text-blue-600">e</span>
        </div>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <div className={cn('size-7 w-7 font-bold text-lg', className)}>
            <span className="text-green-600">W</span>
            <span className="text-blue-600">e</span>
        </div>
    )
}
