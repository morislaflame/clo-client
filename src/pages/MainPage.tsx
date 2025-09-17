import ProductFilters from "@/components/ProductFilters";
import ProductList from "@/components/ProductList";

const MainPage = () => {
    return (
        <div className="min-h-screen">
            <div className="w-full p-4">
                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 w-full">
                    {/* Фильтры - на мобильных сверху, на десктопе сбоку */}
                    <div className="lg:col-span-1 order-first">
                        <div className="lg:sticky lg:top-6">
                            <ProductFilters />
                        </div>
                    </div>
                    
                    {/* Основной контент со списком товаров */}
                    <div className="lg:col-span-3 order-last lg:order-none">
                        <ProductList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;