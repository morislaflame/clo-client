import ProductFilters from "@/components/ProductFilters";
import ProductList from "@/components/ProductList";

const MainPage = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Боковая панель с фильтрами */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <ProductFilters />
                    </div>
                </div>
                
                {/* Основной контент со списком товаров */}
                <div className="lg:col-span-3">
                    <ProductList />
                </div>
            </div>
        </div>
    );
};

export default MainPage;