export default function DescriptionCard({ title, icon, styles, onClick, isSelected }) {
    return (
        <section onClick={onClick} className={`cursor-pointer flex flex-col gap-2 items-center justify-center font-mono italic font-semibold ${isSelected ? styles : 'text-slate-400'}`}>
            <div className="icon text-2xl md:text-lg">
                {icon}
            </div>
            <h1 className="hidden md:block md:text-lg">{title}</h1>
        </section>
    );
}