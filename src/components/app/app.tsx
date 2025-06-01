import { MainPage } from "../../pages/main-page/main-page";

interface AppProps {
  rentalOffersCount: number;
}

function App({ rentalOffersCount }: AppProps) {
  return <MainPage rentalOffersCount={rentalOffersCount} />;
}

export { App };
