import React from "react";
import NumericInputBox from './NumericInputBox'
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export default function App() {
  const [values,setValues] = React.useState({value:1.5,updareCount:0});
  
  //return <Sample/>;

  return (
    <div style={{width:'450px'}}>
    <div> SelectedValue: {values.value}  {typeof values.value} UpdateCount: {values.updareCount}</div>
  <NumericInputBox 
              //debug
              //placement="right-end"
              step={0.1}
              value={values.value}
              decimalScale={5}
              fixedDecimalScale={true}
              optionHeaderHeight={53}
              optionHeight={33}
              //allowNegative={false}
              valueChanged={(change)=>{
                console.log("Publish Value Changed")
                setValues({value:change,updareCount:values.updareCount+1})
              }}
              generateOptions={(value)=>range(-5, 50).map(x=>{return {value:value + x,otherValue:128}})}
              
              optionHeader={()=>( <TableHead>
                <TableRow>
                    <TableCell key={"1"} align={'left'}>Head1</TableCell>
                    <TableCell key={"2"} align={'left'}>Head2</TableCell>
                    <TableCell key={"3"} align={'right'}>Head3</TableCell>
                </TableRow>
              </TableHead>)}
              optionRow={(data,props,isSelected)=>(<TableRow 
                hover selected={isSelected} role="checkbox" tabIndex={-1}
                {...props}
                key={data.value}>
              <TableCell key={"0"} align={"left"}>{data.value}</TableCell>
              <TableCell key={"1"} align={"left"}>{data.otherValue}</TableCell>
              <TableCell key={"2"} align={"right"}>Some Constant</TableCell>
          </TableRow>)}
          />
      </div>);
}