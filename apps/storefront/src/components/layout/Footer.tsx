import Link from "next/link";


export const Footer = () => {
  
  

  return (
    <footer className="bg-brand-600 text-white mt-auto">
      <div className="max-w-360 mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {}
          <div className="flex flex-col items-start">
             <Link href="/" className="flex flex-col text-white mb-4">
                <span className="text-3xl font-bold tracking-wider leading-none">RM</span>
                <span className="text-[12px] tracking-[0.2em] font-medium mt-1 uppercase text-white/80">Medwear</span>
              </Link>
          </div>

          {}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white/90">Menu</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
            </ul>
          </div>

          {}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white/90">Social Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Whatsapp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
            </ul>
          </div>

          {}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white/90">Contact Us</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Email: info@rmmedwear.com</li>
              <li>Phone: +962 00 000 0000</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};
