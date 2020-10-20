import React, { useState } from 'react'; 
import { Document, Page, pdfjs } from 'react-pdf'; 
import { Button } from "react-bootstrap";
import styled from "styled-components";


export default function PDFview(props) { 
const url = "https://cors-anywhere.herokuapp.com/"+props.document;

pdfjs.GlobalWorkerOptions.workerSrc = 
`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 
const [numPages, setNumPages] = useState(null); 
const [pageNumber, setPageNumber] = useState(1); 

document.addEventListener("contextmenu", (event) => { 
	event.preventDefault(); 
}); 
	
/*When document gets loaded successfully*/
function onDocumentLoadSuccess({ numPages }) { 
	setNumPages(numPages); 
	setPageNumber(1); 
} 

function changePage(offset) { 
	setPageNumber(prevPageNumber => prevPageNumber + offset); 
} 

function previousPage() { 
	changePage(-1); 
} 

function nextPage() { 
	changePage(1); 
} 

return ( 
	<> 
	<div class="container" style={{marginLeft: "auto", marginRight: "auto", width: "80%"}}>
		<div >
			<div className="pagec">
				Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'} 
			</div>
			<div className="buttonc" style={{marginTop:"10px"}}>
				<Button type="button" disabled={pageNumber <= 1} onClick={previousPage} className="Pre" style={{marginRight:"10px"}}> 
				Previous 
				</Button> 
				<Button type="button" disabled={pageNumber >= numPages} onClick={nextPage}> 
				Next 
				</Button> 
			</div>
			<div class="row justify-content-start" style={{marginLeft: "-100px"}} >
				<Document file={url} onLoadSuccess={onDocumentLoadSuccess}> 
					<Page size="A5" pageNumber={pageNumber}/> 
				</Document> 
			</div>
		</div>
	</div>
	</> 
); 
}
