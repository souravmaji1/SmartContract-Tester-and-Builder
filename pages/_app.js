import { ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ethers } from 'ethers';

const muiTheme = createTheme();



const activeChain = 'mumbai';

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={muiTheme}>
		<ThirdwebProvider
			activeChain={activeChain}
			
			clientId="7ae9dc2c8d8d84e878c35441de42484c"
		>
			<Component {...pageProps} />
		</ThirdwebProvider>
		</ThemeProvider>
	);
}

export default MyApp;
