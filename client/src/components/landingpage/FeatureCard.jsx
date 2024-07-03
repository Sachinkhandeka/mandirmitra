export default function FeatureCard({ icon, title, description, style }) {
    return (
        <div className={`${style !== '' ? style : '' } p-4 rounded shadow text-black`} data-aos="flip-left">
            <div className="text-3xl mb-2">{icon}</div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-gray-700">{description}</p>
        </div>
    );
}