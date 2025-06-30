import {
  Box,
  Button,
  ChakraProvider,
  extendTheme,
  useColorMode,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import {
  MemoryRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

<<<<<<< HEAD
<<<<<<< HEAD
//import AcceptHerblineWeight from "./sections/AcceptHerblineWeight";
//import AcceptTealineWeight from "./sections/AcceptTealineWeight";
//import ProcessBlendsheetSelect from "./sections/ProcessBlendsheetSelect";
=======
import AcceptHerblineWeight from "./sections/AcceptHerblineWeight";
// import AcceptTealineWeight from "./sections/AcceptTealineWeight";
// import ProcessBlendsheetSelect from "./sections/ProcessBlendsheetSelect";
>>>>>>> d8b0c0e9e145b703b1b81df25a4b302d1b82a61a
//import AcceptTealineSelect from "./sections/AcceptTealineSelect";
//import AcceptDispatch from "./sections/AcceptDispatch";
//import ProcessBlendsheetScan from "./sections/ProcessBlendsheetScan";
// import ProcessFlavorsheetSelect from "./sections/ProcessFlavorsheetSelect";
<<<<<<< HEAD
import ProcessBlendsheetWeight from "./sections/ProcessBlendsheetWeight";
//import ProcessFlavorsheetScan from "./sections/ProcessFlavorsheetScan";
=======
//import ProcessBlendsheetWeight from "./sections/ProcessBlendsheetWeight";
import ProcessFlavorsheetScan from "./sections/ProcessFlavorsheetScan";
>>>>>>> d8b0c0e9e145b703b1b81df25a4b302d1b82a61a
=======
// import AcceptHerblineWeight from "./sections/AcceptHerblineWeight";
import AcceptTealineWeight from "./sections/AcceptTealineWeight";
// import ProcessBlendsheetSelect from "./sections/ProcessBlendsheetSelect";
import AcceptTealineSelect from "./sections/AcceptTealineSelect";
// import AcceptDispatch from "./sections/AcceptDispatch";
// import ProcessBlendsheetScan from "./sections/ProcessBlendsheetScan";
// import ProcessFlavorsheetSelect from "./sections/ProcessFlavorsheetSelect";
// import ProcessBlendsheetWeight from "./sections/ProcessBlendsheetWeight";
// import ProcessFlavorsheetScan from "./sections/ProcessFlavorsheetScan";
>>>>>>> e9ac78a81b867df14ad344e3ae1fe686b095ff88
// import ProcessFlavorsheetSelect from "./sections/ProcessFlavorsheetSelect";
// import ProcessFlavorsheetWeight from "./sections/ProcessFlavorsheetWeight";

const inputStyles = {
  variants: {
    outline: (props) => ({
      field: {
        _hover: {
          borderColor: mode("gray.500", "whiteAlpha.400")(props),
        },
      },
    }),
  },
};

const theme = extendTheme({
  styles: {
    global: (props) => ({
      "html, body, #root": {
        height: "100%",
      },
      "*, *::before, &::after": {
        borderColor: mode("gray.400", "whiteAlpha.300")(props),
      },
    }),
  },
  components: {
    Select: inputStyles,
    Input: inputStyles,
    Button: {
      defaultProps: { colorScheme: "green" },
    },
    Table: {
      variants: {
        simple: (props) => ({
          th: {
            borderColor: mode("gray.400", "whiteAlpha.300")(props),
          },
          td: {
            borderColor: mode("gray.400", "whiteAlpha.300")(props),
          },
        }),
      },
    },
    VariantBox: {
      variants: {
        default: (props) => ({
          textColor: mode("gray.800", "whiteAlpha.900")(props),
        }),
        success: (props) => ({
          textColor: mode("green.500", "green.300")(props),
        }),
        danger: (props) => ({
          textColor: mode("red.500", "red.300")(props),
        }),
        quiet: (props) => ({
          textColor: mode("gray.600", "whiteAlpha.700")(props),
        }),
      },
      defaultProps: {
        variant: "default",
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
<<<<<<< HEAD
<<<<<<< HEAD
      <ProcessBlendsheetWeight />
=======
      <ProcessFlavorsheetScan />
>>>>>>> d8b0c0e9e145b703b1b81df25a4b302d1b82a61a
      {/* <ColorModeWrapper>
        <Router>
          <Switch>
             <Route path="/herbline">
                <AcceptHerblineWeight />
              </Route> 
            <Route path="/tealine">
              {({ location }) =>
                location.state ? (
                  <AcceptTealineWeight />
                ) : (
              <AcceptTealineSelect />
               )
              } 
            </Route>
             <Route path="/blendsheet/active">
                <ProcessBlendsheetWeight />
              </Route>
=======
      {/* <ColorModeWrapper> */}
      <Router>
        <Switch>
          {/* <Route path="/herbline">
            <AcceptHerblineWeight />
          </Route> */}
          <Route path="/tealine">
            {({ location }) =>
              location.state ? <AcceptTealineWeight /> : <AcceptTealineSelect />
            }
          </Route>
          {/* <Route path="/blendsheet/active">
            <ProcessBlendsheetWeight />
          </Route>
>>>>>>> e9ac78a81b867df14ad344e3ae1fe686b095ff88

          <Route path="/blendsheet" exact>
            {({ location }) =>
              location.state ? (
                <ProcessBlendsheetScan />
              ) : (
                <ProcessBlendsheetSelect />
              )
            }
          </Route>
          <Route path="/flavorsheet/active">
            <ProcessFlavorsheetWeight />
          </Route>

          <Route path="/flavorsheet" exact>
            {({ location }) =>
              location.state ? (
                <ProcessFlavorsheetScan />
              ) : (
                <ProcessFlavorsheetSelect />
              )
            }
          </Route>

          <Route path="/dispatch">
            <AcceptDispatch />
          </Route> */}

          <Route path="/" exact>
            <Redirect to="/tealine" />
          </Route>
        </Switch>
      </Router>
      {/* </ColorModeWrapper> */}
    </ChakraProvider>
  );
}

function ColorModeWrapper(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box position="relative" h="100%">
      <Button position="absolute" top={2} right={2} onClick={toggleColorMode}>
        {colorMode}
      </Button>
      {props.children}
    </Box>
  );
}

export default App;
