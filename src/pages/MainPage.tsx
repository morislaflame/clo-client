import ProductFilters from "@/components/ProductFilters";
import ProductList from "@/components/ProductList";
import BannerCarousel from "@/components/BannerCarousel";
import PageWrapper from "@/components/PageWrapper";

const MainPage = () => {
    return (
        <PageWrapper>
            <BannerCarousel />
            <div className="w-full px-4 pb-4">
                {/* Баннер */}
                
                
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
        </PageWrapper>
    );
};

export default MainPage;