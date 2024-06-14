import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Helmet } from 'react-helmet-async';

export default function CardComponent({ total, label, compStyle, IconComponent, progressColor }) {
    // Calculate the percentage value
    const percentage = Math.min((parseInt(total)/ 100) * 100, 100);
    return (
        <>
        <Helmet>
            <title>{label} - Temple Analytics</title>
            <meta name="description" content={`Analytical card component displaying ${label} with total ${total}.`} />
        </Helmet>
        <section className={`${compStyle ? compStyle : '' } rounded-md p-4 border border-b-4 w-full shadow-lg`} >
            <h1 className={`text-sm font-serif uppercase font-medium text-gray-400 dark:text-white`} >{ label }</h1>
            <div className="w-full flex items-center justify-between" >
                <div  className=" w-full flex items-center gap-4" >
                    {IconComponent && <IconComponent size={28} color={progressColor} />}
                    <h1 className="text-gray-400 dark:text-white" >
                        <span className="text-2xl font-sans font-bold text-black dark:text-white mr-3" >{ total }</span>
                    </h1>
                </div>
                <div className="relative rounded-full py-2 px-3 text-center" >
                    <CircularProgressbar 
                        value={ percentage }
                        strokeWidth={6}
                        styles={{ 
                            root : { width : '100%', height:'100%', position:'absolute', top:'0', left:'0' },
                            path : { stroke : `${progressColor}` },
                        }} 
                    />
                    <h3 className="text-md font-medium text-center" >{ Math.round(percentage) }</h3>
                </div>
            </div>
        </section>
        </>
    );
}