import React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



const filterOptions = (options, { inputValue }) => options;
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiAutocomplete-listbox": {
        border: "2px solid yellow",
        fontSize: 18,
        //backgroundColor:'red'
      }
    }
  })
);

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const useStyles2 = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 200,
  },
});

const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  var selected = props.getValue();
  const classes = useStyles2();
  const itemData = React.Children.toArray(children);
  const scrollableListRef = React.createRef();
//  console.log(other);
  //console.log(children);
  const setRef = element =>{
    //scrollableListRef = element;
    if (element != null)
    {
      // How do i know this is the first input?
      element.scrollTo(0, 300)
    }
  }
  return (
    <div ref={ref} {...other}>
      <OuterElementContext.Provider value={other}>
      <TableContainer className={classes.container} ref={setRef}>
      <Table stickyHeader size="small" aria-label="a dense sticky table">
      <TableHead>
            <TableRow>
                <TableCell
                  key={"1"}
                  align={'left'}
                  //style={{ minWidth: column.minWidth }}
                  >
                  Head1
                </TableCell>
                <TableCell
                  key={"2"}
                  align={'left'}
                  //style={{ minWidth: column.minWidth }}
                  >
                  Head2
                </TableCell>
                <TableCell
                  key={"3"}
                  align={'right'}
                  //style={{ minWidth: column.minWidth }}
                  >
                  Head3
                </TableCell>              
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map(x=>
            {
              return (<TableRow 
                hover
                selected={x.key == selected.value}
               role="checkbox"
                tabIndex={-1}
                 key={x.key}
                 {...x.props}>
              <TableCell key={"0"} align={"left"}>
              "1"
              </TableCell>
              <TableCell key={"1"} align={"left"}>
              "2"
              </TableCell>
              <TableCell key={"2"} align={"right"}>
                3
              </TableCell>
          </TableRow>)
            })}
          </TableBody>
      </Table>
      </TableContainer>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  //console.log(other);
  
  return (
    <NumberFormat
    {      ...other    }
      getInputRef={inputRef}
      style={{ textAlign: "center" }}
      onValueChange={(values) => {
        console.log("NumberFormat::OnChange")
        console.log(values)
        if (props.value != values.value)
        {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }
      }}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default function FormattedInputs() {
  const [values, setValues] = React.useState({
    numberformat: "14"
  });

  const handleChange = (event) => {
    //console.log(event.target.value);
    setValues({
      ...values,
      numberformat: event.target.value
    });
  };

  const CustomPopper = function (props) {
    const classes = useStyles();
    return <Popper {...props} className={classes.root} placement="top" />;
  };
  
  return (
    <div style={{margin:'400px', width:'300px'}}>
    <Autocomplete
      freeSolo
      options={top100Films}
      disableClearable     
      selectOnFocus      
      value={top100Films[11]}
      inputValue={values.numberformat}
      ListboxComponent={ListboxComponent}
      ListboxProps={{getValue:()=>top100Films[11]}}
      onOpen={()=>{
        let x =5;
        x++;
        console.log("autocomplete is open")
      }
      }
      onChange={(event, value) => {
        console.log("Autocomplete::onChange")
        //console.log(event)
        //console.log(value)
        setValues({
          ...values,
          numberformat: value.value
        });
      
      }
      }
      onInputChange={(event, value,type) => {
        //if (type !== 'reset')
        {
          console.log("Autocomplete::onInputChange")
          console.log(value)
          setValues({
          ...values,
          numberformat: value
        })  
        }
        }}
      getOptionLabel={(option) => {
        if (typeof option == 'string')
        {
          return  option;
        }
        return option.value;
      }}
      filterOptions={filterOptions}
      /*renderOption={(option) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={option.value}>
                    <TableCell key={"0"} align={"left"}>
                    {option.value}
                    </TableCell>
                    <TableCell key={"1"} align={"left"}>
                    {option.year}
                    </TableCell>
                    <TableCell key={"2"} align={"right"}>
                      3
                    </TableCell>
                </TableRow>
//        <React.Fragment>
  //        <span>Custome Row: + {option.value}</span>
    //    </React.Fragment>
      )}*/
      PopperComponent={CustomPopper}
      renderInput={(params) => {
        //console.log(params);
        return (
          <TextField
            {...params}
            //value={values.numberformat}
            //onChange={handleChange}
            name="numberformat"            
            type="tel"
            InputProps={{
              ...params.InputProps,
              inputComponent: NumberFormatCustom,
              startAdornment: (
                <InputAdornment position="start">
                  <button>+</button>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  Lots
                  <button>-</button>
                </InputAdornment>
              )
            }}
          />
        );
      }}
    />
    
    </div>
  );
}

const top100Films = [
  { value: "1", year: 1994 },
  { value: "2", year: 1994 },
  { value: "3", year: 1994 },
  { value: "4", year: 1994 },
  { value: "5", year: 1994 },
  { value: "6", year: 1994 },
  { value: "7", year: 1994 },
  { value: "8", year: 1994 },
  { value: "9", year: 1994 },
  { value: "10", year: 1994 },
  { value: "11", year: 1994 },
  { value: "12", year: 1994 },
  { value: "13", year: 1994 },
  { value: "14", year: 1994 },
  { value: "15", year: 1994 },
  { value: "16", year: 1994 },
  { value: "17", year: 1994 },
  { value: "18", year: 1994 },
  { value: "19", year: 1994 },
  { value: "20", year: 1994 },
  { value: "21", year: 1994 },
  { value: "22", year: 1994 },
];
