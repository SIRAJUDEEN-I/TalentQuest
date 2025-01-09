import React from "react";

function Header(){

    return <header className="py-10 bg-[#D7DEDC] text-gray-500 flex justify-between items-center">Header
    <Link href={"/"}>
    <Image src="/logo.svg" alt="logo" width={100} height={100}/>
    </Link>
    </header>;
}

export default Header;