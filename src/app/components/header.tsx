const Header: React.FC = () => {
    return (
        <header className="bg-red-600 text-white py-4 z-50 top-0">
        <div className="container mx-auto flex justify-between items-center">
            
            <a href="#" className="flex items-center space-x-2">
                <img src="https://via.placeholder.com/40" alt="Logo" className="w-10 h-10 rounded-full" />
                <span className="text-lg font-bold">Navidad Feliz</span>
            </a>
            
            
            <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-yellow-300 transition">Inicio</a>
                <a href="#" className="hover:text-yellow-300 transition">Promociones</a>
                <a href="#" className="hover:text-yellow-300 transition">Regalos</a>
                <a href="#" className="hover:text-yellow-300 transition">Contacto</a>
            </nav>
            
            
            <a href="#" className="hidden md:inline-block bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-full shadow transition">
                ¡Compra Ahora!
            </a>
            
            
            <button className="md:hidden flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </div>
    </header>
    )
}

export default Header