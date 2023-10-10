import React, { ComponentProps, useEffect, useState } from 'react';
import logo from './logo.svg';
import  './App.css';
import  './css/bootstrap.css';
interface SelectProp {
  id?:number,
  label?:string,
  select?:boolean | false
}  

function App() {
  const [search, setSearch] = useState<string>('');
  const [resultlist, setResultlist] = useState<Array<SelectProp>>([]);
  const [loading, setLoading] = useState(false);
  const onSearch =  ( ) => { 
      try {
        setLoading(true)
    setTimeout(async() => {
      const response=   await fetch('http://localhost:5001/kategoriler?search='+search);
      const  data=await response.json() as Array<string>;
      const cnvrtdata=data.map((v,ind)=>{
       const sel:SelectProp={
         id:ind+1,
         label:v,
         select:false
       }
       return sel;
      });
      let listStore= JSON.parse(window.localStorage.getItem('list')?? '[]') as Array<SelectProp>;
      setResultlist([...listStore,...cnvrtdata.filter(x=>!listStore?.find(t=>t.label===x.label))]);
      setLoading(false)
    }, 2000);
      } catch (error) {
        setResultlist([]);
        setLoading(false)
      }
    
     
   }

   
  const onSelect = (item:SelectProp) => {
     
    item.select=!item.select;
    let listStore= JSON.parse(window.localStorage.getItem('list')?? '[]') as Array<SelectProp>;
    let filterlist=[...resultlist.filter(x=>!listStore?.find(t=>t.label===x.label))].filter(x=>x.label!==item.label);
    listStore=listStore.filter(x=>x.label!==item.label);
    if(item.select){
      filterlist=[item,...listStore,...filterlist]
      
    }else{
      filterlist=[...listStore,...filterlist,item]
    }
    let selectlist=filterlist.filter(x=>x.select===true);
     window.localStorage.setItem('list',JSON.stringify(selectlist))
     setResultlist(filterlist);
  }
  

  useEffect(() => {
    const listStore= JSON.parse(window.localStorage.getItem('list')?? '[]') as Array<SelectProp>;
    setResultlist(listStore);
  }, [ ])

  return (
    <div className="App">
        
          <div className='card'>
          <h4 style={{textAlign:'left'}} >Kategoriler</h4>
          <div className='search' >
            <input placeholder='Kategori ara...'  className='form-control'  style={{height:'2rem'}} value={search} onChange={(e)=>setSearch(e.target.value)} />
            <img  src='./search.svg' width='20px' />
          </div>
           {loading&&<div>Aranıyor...</div>} 
           <div className='list'>
           <ul className='list-group'>
              {
                resultlist.map((str,ind)=>{

                  return <li key={str.label} className='list-item border' >
                         <input  type='checkbox'   checked={str.select} onChange={(e)=>onSelect(str)}  />
                         <label className={str.select?'list-item-select':''} >{str.label}</label>
                  </li>
                })
              }
          </ul>
           </div>
         
           <button className="btn   ara-btn  " type="button" onClick={()=>onSearch()} >Ara</button>
          </div>
         
       
    </div>
  );
}

export default App;


interface IDictionary<TValue> {
  [id: string]: TValue;
}


export class ErrorBoundary extends React.Component<any> {
  constructor(props:any) {
    super(props);
     
  }
   
  static getDerivedStateFromError(error:any) {
    
    return { hasError: true };
  }

  componentDidCatch(error:any, errorInfo:any) {
    console.log(error, errorInfo);
  }

  render() {
    const error=this.state as IDictionary<any>;
    if (error?.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

 