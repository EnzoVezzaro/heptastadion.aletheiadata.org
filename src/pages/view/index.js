import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  useHistory,
  Link
} from "react-router-dom";
import Papa from 'papaparse'

import '../../styles/main.css';
import './style.css';

import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';

export default function View() {

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  let urlOriginal = params.url;

  const cors_anywhere = 'https://cors-aletheiadata.herokuapp.com';

  const protocol = urlOriginal.includes("ipfs");;

  let url;
  if (protocol){
    url = `https://${urlOriginal}`
  } else {
    url = `${cors_anywhere}/${urlOriginal}`
  }

  let history = useHistory();
  
  let [data, setData] = useState([]);
  let [header, setHeader] = useState([]);

  useEffect(() => {
    Papa.parse(url, {
      download: true,
      encoding: "ISO-8859-1",
      header: true,
      complete: response => {
        
        let data = response.data;
        // console.log(data);
        if (data){
          setData(data);
          let fields = response.meta.fields;
          setHeader(fields);
        }
      },
      error: function(err, file, inputElem, reason)
      {
        alert('no data');
        // executed if an error occurs while loading the file,
        // or if before callback aborted for some reason
      }
    });
  }, [])

  let [openSearch, setOpenSearch] = useState(false);

  return (
    <div className="view">
      <svg className="hidden">
        <defs>
          <symbol id="icon-arrow" viewBox="0 0 24 24">
            <title>arrow</title>
            <polygon points="6.3,12.8 20.9,12.8 20.9,11.2 6.3,11.2 10.2,7.2 9,6 3.1,12 9,18 10.2,16.8 "/>
          </symbol>
          <symbol id="icon-drop" viewBox="0 0 24 24">
            <title>drop</title>
            <path d="M12,21c-3.6,0-6.6-3-6.6-6.6C5.4,11,10.8,4,11.4,3.2C11.6,3.1,11.8,3,12,3s0.4,0.1,0.6,0.3c0.6,0.8,6.1,7.8,6.1,11.2C18.6,18.1,15.6,21,12,21zM12,4.8c-1.8,2.4-5.2,7.4-5.2,9.6c0,2.9,2.3,5.2,5.2,5.2s5.2-2.3,5.2-5.2C17.2,12.2,13.8,7.3,12,4.8z"/><path d="M12,18.2c-0.4,0-0.7-0.3-0.7-0.7s0.3-0.7,0.7-0.7c1.3,0,2.4-1.1,2.4-2.4c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7C15.8,16.5,14.1,18.2,12,18.2z"/>
          </symbol>
          <symbol id="icon-search" viewBox="0 0 24 24">
            <title>search</title>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </symbol>
          <symbol id="icon-cross" viewBox="0 0 24 24">
            <title>cross</title>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </symbol>
        </defs>
      </svg>
      <div className={ `search ${openSearch ? 'search--open' : '' }` }>
        <button id="btn-search-close" onClick={()=>setOpenSearch(false)} className="btn btn--search-close" aria-label="Close search form"><svg className="icon icon--cross"><use xlinkHref="#icon-cross"></use></svg></button>
      </div>
      <div className={ `page ${openSearch ? 'page--move' : '' }` }>
        
        <div className="page__folder page__folder--dummy"></div>
        <div className="page__folder page__folder--dummy"></div>
        <div className="page__folder page__folder--dummy"></div>
        
        <main className="main-wrap page__folder">
          <header className="listing-header">
            <div className="listing-links">
              <a className="codrops-icon codrops-icon--prev" href={`_search?url=${urlOriginal}`} ><svg className="icon icon--arrow"><use xlinkHref="#icon-arrow"></use></svg></a>
              <Link className="codrops-icon codrops-icon--drop" to="/"><img style={{ width: '25px' }} src="/assets/img/logo.svg"></img></Link> 
            </div>
            <div className="search-wrap hide">
              <button id="btn-search" onClick={()=>setOpenSearch(true)} className="btn btn--search"><svg className="icon icon--search"><use xlinkHref="#icon-search"></use></svg></button>
            </div>
          </header>
          <div className="content">
            <div className="search-bar">
              <div className={ `search search--open` }>
                
              </div>
            </div>
            <div className="content-page">
                <HotTable 
                  data={data} 
                  colHeaders={true} 
                  rowHeaders={true} 
                  autoRowSize={true}
                  autoColumnSize={true}
                  colHeaders={header}
                />
            </div>
          </div>
          <div className="bottom-nav">
            <nav className="pagination-units">
              
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}
