import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img {...props} src="/logo.ico" alt="App Logo" className={props.className} />
    );
}
