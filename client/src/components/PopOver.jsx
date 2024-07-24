import { Button, Popover } from "flowbite-react";
import { IoIosArrowDown } from "react-icons/io";

export function PopOver({ asset }) {
    const getProfileLetters = (fullName) => {
        const slicedParts = fullName.split(' ');
        const firstLetters = slicedParts.map(chunk => chunk.charAt(0));
        return firstLetters.join('');
    };
  return (
        <Popover
            aria-labelledby="profile-popover"
            trigger="hover"
            content={
                <div className="w-64 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <a href="#">
                            <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-500">
                                <span className="text-xs text-gray-100 dark:text-gray-300">
                                    {getProfileLetters(asset.rentDetails.tenant.name)}
                                </span>
                            </div>
                        </a>
                        <div>
                            <button
                                type="button"
                                className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Reciept
                            </button>
                        </div>
                    </div>
                    <p id="profile-popover" className="text-base font-semibold leading-none text-gray-900 dark:text-white">{ asset.name }</p>
                    <p className="mb-3 text-sm font-normal">{ asset.rentDetails.tenant.name }</p>
                    <div className="p-4 bg-gradient-to-r from-neutral-300 to-stone-400  dark:from-slate-900 dark:to-slate-700 rounded-md" >
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold" >From : </span>
                            <span>
                                {new Date(asset.rentDetails.leaseStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ', ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold" >To : </span>
                            <span>
                                {new Date(asset.rentDetails.leaseEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ', ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold" >Amount : </span>
                            <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(asset.rentDetails.rentAmount)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold" >Status : </span>
                            <span className={`${ asset.rentDetails.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600' }`} >{ asset.rentDetails.paymentStatus }</span>
                        </div>
                    </div>
                </div>
            }
        >
            <p className="cursor-pointer" ><IoIosArrowDown /></p>
        </Popover>
  );
}