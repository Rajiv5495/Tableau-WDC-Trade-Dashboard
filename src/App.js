
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography'
import AnnualConnector from './WebDataConnector/tableSchema';
import escapeRegExp from "lodash/escapeRegExp";
import HS_Data from './HS_JsonData';

const MAX_DISPLAYED_OPTIONS = 25;

const { tableau } = window;
let connector = AnnualConnector();
tableau.registerConnector(connector);

const optionsCC = HS_Data.results;
console.log(optionsCC)
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formControl: {
    margin: theme.spacing(3),
    width: 400
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
    width: 150
  },
  select: {
    margin: theme.spacing(2,0,0,0)
  }
}));

function App() {
  const classes = useStyles();
  const [ccSelected, setCcSelected] = React.useState(JSON.parse(localStorage.getItem('HSOptions')));
  const [inputValue, setInputValue] = React.useState("");
  const [count, setCount] = React.useState(0);


  const filteredOptions = React.useMemo(() => {
    if (!inputValue) {
      return optionsCC;
    }

    const matchByStart = [];
    const matchByInclusion = [];

    const regByInclusion = new RegExp(escapeRegExp(inputValue), "i");
    const regByStart = new RegExp(`^${escapeRegExp(inputValue)}`, "i");

    for (const option of optionsCC) {
      if (regByInclusion.test(option.label)) {
        if (regByStart.test(option.label)) {
          matchByStart.push(option);
        } else {
          matchByInclusion.push(option);
        }
      }
    }

    return [...matchByStart, ...matchByInclusion];
  }, [inputValue]);

  const slicedOptions = React.useMemo(
    () => filteredOptions.slice(0, MAX_DISPLAYED_OPTIONS),
    [filteredOptions]
  );

  const handleCcSelect = (selectedOptions) => {
    if (count < 20) {
      console.log(count)
      setCcSelected(selectedOptions)
      setCount(selectedOptions.length)
      console.log(selectedOptions)
    }
    
  }

  const handleSubmit = (event) => {
    event.preventDefault();   
    
    var paramObj = {
      
        cc: ccSelected,//'AG2',//ccSelected[0].value,
    
    }
    localStorage.setItem('HSOptions', JSON.stringify(ccSelected))

    tableau.connectionData = JSON.stringify(paramObj);
    tableau.connectionName = "UN Comtrade Data"; // This will be the data source name in Tableau
    tableau.submit(); // This sends the connector object to Tableau
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel className={classes.select}>
            <Typography variant="h5">Classification Code: </Typography>
          </FormLabel>
          <Select
            isMulti={true}
            width='400px'
            value={ccSelected}
            onChange={handleCcSelect}
            options={slicedOptions}
            onInputChange={(value) => setInputValue(value)}
            filterOption={() => true}
          />
          <Button type="submit" variant="outlined" color="primary" className={classes.button}>
            Get Data
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
export default App;
