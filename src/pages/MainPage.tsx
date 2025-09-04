import { observer } from "mobx-react-lite";

const MainPage = observer(() => {
    return (
        <div>
            {/* <img src="https://i.pinimg.com/1200x/e1/83/74/e183745e034cffdb4d5b0d78df4e748c.jpg" alt="Logo" className="h-full w-full" /> */}
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <img src="https://i.pinimg.com/1200x/e1/83/74/e183745e034cffdb4d5b0d78df4e748c.jpg" alt="Logo" className="h-full w-full" />
                </div>
                <div className="col-span-12">
                    <h1>GHETTO&CO</h1>
                </div>
            </div>
            
        </div>
    );
});

export default MainPage;
