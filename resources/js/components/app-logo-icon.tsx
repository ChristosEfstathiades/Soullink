import { SVGAttributes } from 'react';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        
        <img {...props} src="/storage/pokeball.svg" alt="" />

    );
}
