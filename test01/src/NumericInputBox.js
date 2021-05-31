import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';

import NumberFormat from "react-number-format";
import Popper from "@material-ui/core/Popper";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import parseDecimalNumber from 'parse-decimal-number';

const usePooperStyles = makeStyles((theme) =>
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

const useListStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 275,
  },
});

const CACHE_CustomPopper = {}
export default function NumericInputBox(props) {

  let CustomPopper = CACHE_CustomPopper[props.placement ?? 'bottom'];
  if (!CustomPopper)
  {
    CustomPopper = function (innerprops) {
      const classes = usePooperStyles();       
      return <Popper {...innerprops} className={classes.root}  placement={props.placement ?? 'bottom'}/>;
    };
    CACHE_CustomPopper[props.placement ?? 'bottom'] = CustomPopper;
  }

  const initialRender = React.useRef(true);
  let [recalcOptions,setrecalcOptions] = React.useState({});
  let [values,setValues] = React.useState({inputValue: getStringValue(props.value,props.decimalScale,props.fixedDecimalScale)});

  let generatedValues = props.generateOptions(props.value);
  const selectedOption =  generatedValues.findIndex(option => option.value == props.value);

  let [options,setOptions] = React.useState({
    selectedValue:selectedOption >= 0 ? getStringValue(generatedValues[selectedOption].value,props.decimalScale,props.fixedDecimalScale) : '',
    selectedIndex:selectedOption,
    calcualtedOptions: generatedValues,
  });
  
  const addToValue = (stepSize)=>{
    let numericValue = parseDecimalNumber(values.inputValue);
    if (Number.isNaN(numericValue))
    {
      numericValue = 0;
    }

    setValues({inputValue: getStringValue(numericValue + stepSize,props.decimalScale,props.fixedDecimalScale)});
  }

  const updateSelectedValue = (value)=>{
    let generatedValues = props.generateOptions(value);
    const selectedOption =  generatedValues.findIndex(option => option.value == value);
    setOptions({
      selectedValue: selectedOption >=0? getStringValue(generatedValues[selectedOption].value,props.decimalScale,props.fixedDecimalScale) : '',
      selectedIndex:selectedOption,
      calcualtedOptions:generatedValues,
    });
    
    setValues({inputValue:getStringValue(value,props.decimalScale,props.fixedDecimalScale)})
  }
  
  React.useEffect(()=>{
    updateSelectedValue(parseDecimalNumber(values.inputValue));
  },[recalcOptions])

  React.useEffect(()=>{
    if (initialRender.current)
    {
      initialRender.current = false;
    }
    else
    {
      let numericValue = parseDecimalNumber(values.inputValue);
      if (Number.isNaN(numericValue))
      {
        props.valueChanged(undefined);
      }
      else
      {
        props.valueChanged(numericValue);
      }
    }
  },[values.inputValue]);
  
  return <Autocomplete
  debug={props.debug}
  freeSolo
  disableClearable
  selectOnFocus={props.selectOnFocus}
  filterOptions={passAllFilterOptions}
  options={options.calcualtedOptions}
  value={options.selectedValue }
  PopperComponent={CustomPopper}
  inputValue={values.inputValue}
  ListboxComponent={ListboxComponent}
  ListboxProps={{options:options,
                 optionHeader:props.optionHeader,
                 optionRow:props.optionRow,
                 optionHeaderHeight:props.optionHeaderHeight,
                 optionHeight:props.optionHeight}}
  onInputChange={(event, value,type) => setValues({inputValue:value})}
  onClose={()=> setrecalcOptions(Object.create(null))}
  onOpen={()=> setrecalcOptions(Object.create(null))}
  onChange={(event, value) => {
    let numericValue = value.value;
    if (typeof value == 'string')
    {
      numericValue = parseDecimalNumber(value);
    }
    setValues({inputValue:getStringValue(numericValue,props.decimalScale,props.fixedDecimalScale)});
    setrecalcOptions(Object.create(null));
  }}
  getOptionLabel={(option) => {
    let numericValue = option.value;
    if (typeof option == 'string')
    {
      if (option == '')
      {
        return '';
      }
      else
      {
        numericValue = parseDecimalNumber(option);
        if (Number.isNaN(numericValue))
        {
          return '';
        }
      }
    }

    return getStringValue(numericValue,props.decimalScale,props.fixedDecimalScale);
  }}

  renderInput={(params) => {
    return (
      <TextField
        {...params}
        inputProps={Object.assign({},params.inputProps,{
          decimalScale:props.decimalScale,
          fixedDecimalScale:props.fixedDecimalScale,
          allowNegative:props.allowNegative})}
        type="tel"
        InputProps={
          {
          ...params.InputProps,
          inputComponent: NumberFormatCustom,
          startAdornment: (
            (props.step && (
            <InputAdornment position="start">
              <button onClick={()=>addToValue((props.step ?? 1) * -1)}>-</button>
            </InputAdornment>))
          ),
          endAdornment: (
            (props.step && (
            <InputAdornment position="start">
              <button onClick={()=>addToValue(props.step ?? 1)}>+</button>
            </InputAdornment>)
            )
          )
        }}
      />
    );
  }}
  />
}

const passAllFilterOptions = (options, { inputValue }) => options;

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat {...other}
      getInputRef={inputRef}
      style={{ textAlign: "center" }}
      onValueChange={(values) => {
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
      decimalScale={props.decimalScale}
      fixedDecimalScale={props.fixedDecimalScale}
      allowNegative={props.allowNegative}
      thousandSeparator
      isNumericString
    />
  );
}

const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  let gridRef = React.useRef(null);
  
  const { children, optionHeader,optionRow,options,optionHeaderHeight,optionHeight, ...other } = props;
  var calcualtedOptions = props.options.calcualtedOptions;
  const classes = useListStyles();
  const setRef = element =>{
    if (gridRef.current == null)
    {
      gridRef.current = element;
      let index = props.options.selectedIndex;
      if (optionHeight && optionHeaderHeight)
      {
        const LIST_ITEM_HEIGHT = optionHeight;
        const NUM_OF_VISIBLE_LIST_ITEMS = (parseInt(getComputedStyle(element).height) - optionHeaderHeight) / optionHeight;
      
        const amountToScroll = LIST_ITEM_HEIGHT * (index) - (LIST_ITEM_HEIGHT * (NUM_OF_VISIBLE_LIST_ITEMS /2));
        if (amountToScroll > 0)
        {
          element.scrollTo(0,amountToScroll);
        }
      }
    }
  }
  let items = [];
  for (let i =0;i<calcualtedOptions.length;i++)
  {
    let generatedItem = children[i];
    if (generatedItem != undefined)
    {
      items.push({listItem:generatedItem, data:calcualtedOptions[i],isSelected:i == props.options.selectedIndex})
    }
  }
  return (
    <div ref={ref} {...other}>
      <TableContainer className={classes.container} ref={setRef}>
      <Table stickyHeader size="small" aria-label="a dense sticky table">
        {props.optionHeader()}
        <TableBody>
          {items.map((item)=>props.optionRow(item.data,item.listItem.props,item.isSelected))}
        </TableBody>
      </Table>
      </TableContainer>      
    </div>
  );
});

const getStringValue = (value,decimalScale,fixedDecimalScale) => {

    if (value || value === 0) {
      if (fixedDecimalScale)
      {
        return new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: decimalScale, minimumFractionDigits: decimalScale })
        .format(value).replaceAll(',','');
      }
      else
      {
        return parseDecimalNumber(new Intl.NumberFormat('en-US', { style: 'decimal',minimumFractionDigits:0,maximumFractionDigits:12})
        .format(value)).toString();
      }
    }

    return '';
};