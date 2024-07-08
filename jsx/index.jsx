const {TextField, Button, Fab, Link, Typography, InputAdornment, Alert, Tabs, Tab} = MaterialUI;
const {Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon, createTheme, ThemeProvider} = MaterialUI;
const {Dialog, DialogActions,DialogContent, DialogContentText, MenuItem, DialogTitle} = MaterialUI;
let {alpha, TableBody, TableCell, TableContainer, RadioGroup, Radio, FormLabel,Rating, Table,
    TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Paper, Checkbox, IconButton, Tooltip,
    Chip, Avatar, FilledInput, FormControl, InputLabel, Breadcrumbs, Input, ListItemAvatar, 
    FormControlLabel,Switch, DeleteIcon, FilterListIcon, visuallyHidden, OutlinedInput,
    FormHelperText
} = MaterialUI;

const {useState, useEffect, createContext, useContext, useLayoutEffect } = React;

const SigninContext = createContext({})
var Context = createContext({});
var user;

let theme = createTheme({
    palette: {
        primary: {
            main: '#36344D',
        },
        secondary: {
            main: '#edf2ff',
        },
    },
});

window.onload = function(){
    ReactDOM.render(<Index />, document.getElementById('root'));
}

function Index(){
    const [files,setFiles] = useState([])
    const [folders,setFolders] = useState([]);
    const [dir,setDir] = useState("../../");
    const [parents, setParents] = useState([]);
    const [done,setDone] = useState(false);
    const [check,setCheck] = useState(false);
    const [backFolders,setBackFolders] = useState([]);
    const [canExtract, setCanExtract] = useState(false);
    const [active,setActive] = useState({
        extension:""
    });
    const [open,setOpen] = useState({
        newFile:false,
        newFolder:false,
        previewFile:false,
        uploadFiles:false,
        compressFiles:false,
        delete:false,
        extract:false
    })

    const parentDir = "../../";

    const openDir = (dir) => {
        $.get("api/", {openDir:dir}, function(response){
            //alert(response);
            try{
                let res = JSON.parse(response);

                if(res.status){
                    setFiles(res.files.map((r=>{
                        r.checked = false;
                        return r;
                    })));
                    setFolders(res.folders.map((r=>{
                        r.checked = false
                        return r;
                    })));

                    if(!done){
                        setParents(res.folders);
                        setDone(true);
                    }
                }
                else{
                    alert(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const shortenName = (name) => {
        if(name.length < 30){
            return name;
        }
        else{
            let chars = name.split(".");
            name = name.substring(0,26)+"..."+chars[chars.length-1];
            return name;
        }
    }

    const _ = (id) => {
        return document.getElementById(id)
    }

    useEffect(()=>{
        //$('#bottom').height(window.innerHeight - $('#top').height())
        $('#structure').css('height', (window.innerHeight - _('top').clientHeight)+"px")
        $('#content').css('height', (window.innerHeight - _('top').clientHeight)+"px");
    }, []);

    useEffect(()=>{
        const listener = (event) => {
            var receivedValue = event.data;
            console.log("Received value from iframe:", receivedValue);
            if (typeof receivedValue == "string"){
                try{
                    let json = JSON.parse(receivedValue);
                    if(json.type == "message"){
                        Toast(json.message);
                    }
                    else{
                        //do nothing
                        console.log(json);
                    }
                }
                catch(E){
                    alert(E.toString()+ receivedValue);
                }
            }
        }

        window.addEventListener('message', listener);

        return ()=>{
            window.removeEventListener('message', listener);
        }
    }, []);

    useEffect(()=>{
        openDir(dir);
        setBackFolders(dir.substring(0,dir.length-1).split("/"));
    }, [dir]);

    useEffect(()=>{
        if(folders.filter(r=>r.checked).length == 0 && files.filter(r=>r.checked).length == 1){
            if(files.filter(r=>r.checked)[0].extension == "zip"){
                setCanExtract(true);
            }
            else{
                setCanExtract(false);
            }
        }
        else{
            setCanExtract(false);
        }
    }, [files,folders]);

    return (
        <Context.Provider value={{dir,setDir,files,setFiles,folders,setFolders}}>
            <ThemeProvider theme={theme}>
                <div className="w3-row w3-padding w3-text-white w3-large" id="top" style={{background:"var(--purple)"}}>
                    <div className="w3-half">
                        {backFolders.map((row,index)=>(
                            <>
                                <font className="pointer px-1 py-1 rounded w3-hover-opacity" onClick={e=>{
                                    setDir(backFolders.slice(0,index+1).join("/")+"/");
                                }}>{row}</font> <font className="w3-opacity">/</font>
                            </>
                        ))}
                    </div>
                    <div className="w3-half">

                        {/*Rename*/ (files.filter(r=>r.checked).length +  folders.filter(r=>r.checked).length) == 1 && <i className="far fa-edit mr-15 pointer w3-hover-text-red" title="Rename" />}
                        {/*Copy,Cut,Lock,Compress,Delete*/ (files.filter(r=>r.checked).length +  folders.filter(r=>r.checked).length) > 0 && <>
                            <i className="far fa-copy mr-15 pointer w3-hover-text-red" title="Copy" />
                            <i className="fa fa-cut mr-15 pointer w3-hover-text-red" title="Cut" />
                            <i className="fa fa-lock mr-15 pointer w3-hover-text-red" title="Lock" />
                            <i className="far fa-file-archive mr-15 pointer w3-hover-text-red" onClick={e=>setOpen({...open, compressFiles:true})} title="Compress" />
                            <i className="far fa-trash-alt mr-15 pointer w3-hover-text-red" onClick={e=>setOpen({...open, delete:true})} title="Delete" />
                        </>}

                        {canExtract && <i className="fa fa-box-open mr-15 pointer w3-hover-text-red" onClick={e=>setOpen({...open, extract:true})} title="Extract" />}

                        <span className="ml-15 mr-15">&nbsp;</span>

                        <i className="fa fa-file-medical mr-15 pointer w3-hover-text-red" onClick={e=>setOpen({...open, newFile:true})} title="New File" />
                        <i className="fa fa-folder-plus mr-15 pointer w3-hover-text-red" onClick={e=>setOpen({...open, newFolder:true})} title="New Folder" />
                        <i className="fa fa-search mr-15 pointer w3-hover-text-red" title="Search" />
                        <i className="fa fa-cloud-upload-alt mr-15 pointer w3-hover-text-red" onClick={e=>setOpen({...open, uploadFiles:true})} title="Upload files" />
                        <i className="fa fa-sync-alt mr-15 pointer w3-hover-text-red" onClick={e=>openDir(dir)} title="Refresh" />
                        <i className="fa fa-th mr-15 pointer w3-hover-text-red" title="Switch to Grid" />
                        <i className="fa fa-power-off mr-15 pointer w3-hover-text-red" title="Logout" />
                    </div>
                </div>
                <div className="w3-row" id="bottom">
                    <div className="w3-col w3-border-right" id="structure" style={{width:"20%",background:"#fafafa",overflowY:"auto"}}> 
                        <h5 className="py-1 px-2">Folder Structure</h5>
                        <div className="w3-padding">
                            <div className="w3-padding-small"><i className="fa fa-angle-down w3-small" /> <i className="fa fa-folder" /> {parentDir}</div>
                            <div className="pl-15">
                                {parents.map((row,index)=>(
                                    <FolderView key={row.name} dir={parentDir} data={row}/>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w3-rest" id="content" style={{overflow:"auto"}}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input type={"checkbox"} checked={check} onChange={e=>{
                                            setCheck(e.target.checked);
                                            setFiles(files.map((r=>{
                                                r.checked = e.target.checked;
                                                return r;
                                            })));
                                            setFolders(folders.map((r=>{
                                                r.checked = e.target.checked
                                                return r;
                                            })));
                                        }} />
                                    </th>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Date</th>
                                    <th>Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {folders.map((row,index)=>(
                                    <tr className="w3-hover-text-purple pointer" key={row.name}>
                                        <td style={{color:"var(--purple)"}}>
                                            <input type={"checkbox"} checked={row.checked} onChange={e=>{
                                                setFolders(folders.map((r,i)=>{
                                                    if(index == i){
                                                        r.checked = e.target.checked
                                                    }
                                                    return r;
                                                }))
                                            }} />
                                        </td>
                                        <td style={{color:"var(--purple)"}} onClick={e=>{
                                            setFolders(folders.map((r,i)=>{
                                                if(index == i){
                                                    r.checked = !r.checked
                                                }
                                                return r;
                                            }))
                                        }} onDoubleClick={e=>setDir(dir+row.name+"/")}><i className="fa fa-folder" /> {row.name}</td>
                                        <td>{row.filesize}</td>
                                        <td>{row.date}</td>
                                        <td>{row.permissions}</td>
                                    </tr>
                                ))}

                                {files.map((row,index)=>(
                                    <tr key={row.name}>
                                        <td style={{color:"var(--purple)"}}>
                                            <input type={"checkbox"} checked={row.checked} onChange={e=>{
                                                setFiles(files.map((r,i)=>{
                                                    if(index == i){
                                                        r.checked = e.target.checked
                                                    }
                                                    return r;
                                                }))
                                            }} />
                                        </td>
                                        <td style={{color:"var(--purple)"}} onClick={e=>{
                                            setFiles(files.map((r,i)=>{
                                                if(index == i){
                                                    r.checked = !r.checked
                                                }
                                                return r;
                                            }))
                                        }} onDoubleClick={e=>{
                                            e.stopPropagation();
                                            setActive(row);
                                            setOpen({...open,previewFile:true})
                                        }}><i className="fa fa-file" /> {shortenName(row.name)}</td>
                                        <td>{row.filesize} kb</td>
                                        <td>{row.date}</td>
                                        <td>{row.permissions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {open.newFile && <NewFile onClose={()=>setOpen({...open, newFile:false})} onSuccess={()=>{
                    setOpen({...open, newFile:false});
                    openDir(dir);
                }} />}

                {open.newFolder && <NewFolder onClose={()=>setOpen({...open, newFolder:false})} onSuccess={()=>{
                    setOpen({...open, newFolder:false});
                    openDir(dir);
                }} />}

                {open.previewFile && <>
                    <PreviewFile data={active} onClose={()=>setOpen({...open, previewFile:false})} />
                </>}

                {open.uploadFiles && <>
                    <UploadFiles onClose={()=>{
                        setOpen({...open, uploadFiles:false})
                        openDir(dir);
                    }} />
                </>}

                {open.compressFiles && <>
                    <CompressFiles onClose={()=>{
                        setOpen({...open, compressFiles:false})
                        openDir(dir);
                    }} />
                </>}

                {open.extract && <>
                    <ExtractFile onClose={()=>{
                        setOpen({...open, extract:false})
                        openDir(dir);
                    }} />
                </>}

                {open.delete && <Warning
                    title="Delete?"
                    secondaryText={`Are you sure you want to delete ${files.filter(r=>r.checked).length} file(s) and ${folders.filter(r=>r.checked).length} folders`}
                    action={{
                        text:"Confirm",
                        callback:()=>{
                            $.post("api/", {
                                deleteFiles:"true",
                                files:JSON.stringify(files.filter(r=>r.checked)),
                                folders:JSON.stringify(folders.filter(r=>r.checked)),
                                dir
                            }, response=>{
                                try{
                                    let res = JSON.parse(response);
                                    if(res.status){
                                        setOpen({...open, delete:false});
                                        //props.onCancel();
                                        Toast("Success");
                                        openDir(dir);
                                    }
                                    else{
                                        Toast(res.message);
                                    }
                                }
                                catch(E){
                                    alert(E.toString()+response);
                                }
                            })
                        }
                    }}
                    onClose={()=>setOpen({...open, delete:false})}
                />}
            </ThemeProvider>
        </Context.Provider>
    )
}

function FolderView(props){
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(false);
    const [folders,setFolders] = useState([]);
    const {dir,setDir} = useContext(Context);

    useEffect(()=>{
        if(open){
            $.get("api/", {openDir:props.dir+props.data.name+"/"}, function(response){
                //alert(response);
                try{
                    let res = JSON.parse(response);
    
                    if(res.status){
                        setFolders(res.folders);

                        if(res.folders.length == 0){
                            setDir(props.dir+props.data.name+"/");
                        }
                    }
                    else{
                        alert(res.message)
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        }
    }, [open]);

    return (
        <>
            <div className="w3-padding-small pointer w3-hover-text-purple" onClick={e=>setOpen(!open)} onDoubleClick={e=>{
                Toast("Double")
                setDir(props.dir+props.data.name+"/");
            }} onMouseEnter={e=>setHover(true)} onMouseLeave={e=>setHover(false)}>
                <i className={"fa w3-small "+(open?"fa-angle-up":"fa-angle-right")} /> 
                <i className="fa fa-folder" style={{marginLeft:"5px",marginRight:"5px"}} /> 
                {props.data.name} <i className="fa fa-long-arrow-alt-right ml-2" style={{visibility:hover?"visible":"hidden"}} onClick={e=>setDir(props.dir+props.data.name+"/")}/>
            </div>
            {open && <div className="pl-3">
                {folders.map((row,index)=>(
                    <FolderView key={row.name} dir={props.dir+props.data.name+"/"} data={row} />
                ))}
            </div>}
        </>
    )
}

function NewFile(props) {
    const [open,setOpen] = useState(true);
    const {dir,setDir} = useContext(Context);
    const [error,setError] = useState("");

    const createFile = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    setOpen(false);
                    if(props.onSuccess != undefined){
                        props.onSuccess()
                    }
                }
                else{
                    setError(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response)
            }
        })
    }

    return (
        <>
            <Dialog open={open} onClose={()=>{
                setOpen(false);
                if(props.onClose != undefined){
                    props.onClose();
                }
            }}>
                <div className="w3-padding" style={{width:"400px"}}>
                    <font className="w3-large">Create New File</font>

                    {error.length > 0 && <Alert severity="warning" onClose={() => setError("")}>{error}</Alert>}

                    <form onSubmit={createFile}>
                        <input type="hidden" name="dir" value={dir}/>
                        <TextField fullWidth label="Enter filename" variant="standard" size="small" name="new_file" sx={{mt:2, mb:3}} />

                        <div className="clearfix">
                            <Button variant="contained" type="submit">Submit</Button>
                            <Button variant="outlined" type="button" color={"error"} className="float-right" onClick={()=>{
                                setOpen(false);
                                if(props.onClose != undefined){
                                    props.onClose();
                                }
                            }}>Close</Button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

function ExtractFile(props) {
    const [open,setOpen] = useState(true);
    const {dir,setDir,files,setFiles} = useContext(Context);
    const [error,setError] = useState("");

    const createFile = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    setOpen(false);
                    if(props.onClose != undefined){
                        props.onClose()
                    }
                }
                else{
                    setError(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response)
            }
        })
    }

    return (
        <>
            <Dialog open={open} onClose={()=>{
                setOpen(false);
                if(props.onClose != undefined){
                    props.onClose();
                }
            }}>
                <div className="w3-padding" style={{width:"400px"}}>
                    <font className="w3-large">Extract File</font>

                    {error.length > 0 && <Alert severity="warning" onClose={() => setError("")}>{error}</Alert>}

                    <form onSubmit={createFile}>
                        <input type="hidden" name="dir" value={dir}/>
                        <input type="hidden" name="zipFile" value={files.filter(r=>r.checked)[0].name}/>
                        <TextField fullWidth label="Enter directory to extract to" variant="standard" size="small" name="extract_dir" sx={{mt:2, mb:3}} />

                        <div className="clearfix">
                            <Button variant="contained" type="submit">Submit</Button>
                            <Button variant="outlined" type="button" color={"error"} className="float-right" onClick={()=>{
                                setOpen(false);
                                if(props.onClose != undefined){
                                    props.onClose();
                                }
                            }}>Close</Button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

function NewFolder(props) {
    const [open,setOpen] = useState(true);
    const {dir,setDir} = useContext(Context);
    const [error,setError] = useState("");

    const createFolder = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    setOpen(false);
                    if(props.onSuccess != undefined){
                        props.onSuccess()
                    }
                }
                else{
                    setError(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response)
            }
        })
    }

    return (
        <>
            <Dialog open={open} onClose={()=>{
                setOpen(false);
                if(props.onClose != undefined){
                    props.onClose();
                }
            }}>
                <div className="w3-padding" style={{width:"400px"}}>
                    <font className="w3-large">Create New Folder</font>

                    {error.length > 0 && <Alert severity="warning" onClose={() => setError("")}>{error}</Alert>}

                    <form onSubmit={createFolder}>
                        <input type="hidden" name="dir" value={dir}/>
                        <TextField fullWidth label="Enter folder name" variant="standard" size="small" name="new_folder" sx={{mt:2, mb:3}} />

                        <div className="clearfix">
                            <Button variant="contained" type="submit">Submit</Button>
                            <Button variant="outlined" type="button" color={"error"} className="float-right" onClick={()=>{
                                setOpen(false);
                                if(props.onClose != undefined){
                                    props.onClose();
                                }
                            }}>Close</Button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

function CompressFiles(props) {
    const [open,setOpen] = useState(true);
    const {dir,setDir,files,folders} = useContext(Context);
    const [error,setError] = useState("");

    const compress = (event) => {
        event.preventDefault();

        $.post("api/", {
            dir,
            files:JSON.stringify(files.filter(r=>r.checked)),
            folders:JSON.stringify(folders.filter(r=>r.checked)),
            zipName:event.target.zipName.value
        }, response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    setOpen(false);
                    if(props.onClose != undefined){
                        props.onClose()
                    }
                }
                else{
                    setError(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response)
            }
        })
    }

    return (
        <>
            <Dialog open={open} onClose={()=>{
                setOpen(false);
                if(props.onClose != undefined){
                    props.onClose();
                }
            }}>
                <div className="w3-padding" style={{width:"400px"}}>
                    <font className="w3-large">Compress Files</font>

                    {error.length > 0 && <Alert severity="warning" onClose={() => setError("")}>{error}</Alert>}

                    <form onSubmit={compress}>
                        <input type="hidden" name="dir" value={dir}/>
                        <FormControl sx={{ mt: 2, mb:3}} fullWidth variant="outlined">
                            <OutlinedInput
                                id="outlined-adornment-weight"
                                name="zipName"
                                endAdornment={<InputAdornment position="end">.zip</InputAdornment>}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                'aria-label': 'weight',
                                }}
                                />
                            <FormHelperText id="outlined-weight-helper-text">Enter filename</FormHelperText>
                        </FormControl>

                        <div className="clearfix">
                            <Button variant="contained" type="submit">Submit</Button>
                            <Button variant="outlined" type="button" color={"error"} className="float-right" onClick={()=>{
                                setOpen(false);
                                if(props.onClose != undefined){
                                    props.onClose();
                                }
                            }}>Close</Button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

function PreviewFile(props){
    const [open,setOpen] = useState(true);
    const [large,setLarge] = useState(false);
    const [active,setActive] = useState(props.data);
    const {dir,setDir} = useContext(Context);
    const [height,setHeight] = useState(500);

    useEffect(()=>{
        setHeight(large? window.innerHeight - $('#topBar').height() : 500);
    }, [large])

    return (
        <>
            <div className="w3-modal" style={{display:open?"block":"none",paddingTop:large?"0px":"80px"}} onClick={e=>{
                setOpen(false);
                if(props.onClose != undefined){
                    props.onClose();
                }
            }}>
                <div className="w3-modal-content w3-round-large" style={{width:large?window.innerWidth+"px":"800px",}} onClick={e=>e.stopPropagation()}>
                    <div className="w3-padding-large rounded-top w3-text-white clearfix" id="topBar" style={{background:"var(--purple)"}}>
                        Preview: {props.data.name}

                        <span className="float-right">
                            <i className="fa fa-expand pointer w3-hover-text-red" onClick={e=>setLarge(!large)} />

                            <i className="fa fa-times ml-3 pointer w3-hover-text-red" title="Close" onClick={e=>{
                                setOpen(false);
                                if(props.onClose != undefined){
                                    props.onClose();
                                }
                            }} />
                        </span>
                    </div>
                    <div className="">
                        {["png", "jpeg", "jpg","webp","gif"].includes(active.extension) ? <div className="w3-center">
                            <img src={dir+active.name} width={"80%"} />
                        </div>:
                        ["html", "css", "php","js","jsx", "xml","json","java", "ini", "htaccess","svg"].includes(active.extension) ? <Editor file={active.name} dir={dir} height={height} extension={active.extension} />:
                        <></>}
                    </div>
                </div>
            </div>
        </>
    )
}

function Editor(props){
    return (
        <>
            <iframe src={`sample.php?dir=${props.dir}&file=${props.file}`} style={{width:"100%", height:props.height+"px",border:"none"}}></iframe>
        </>
    )
}

function UploadFiles(props){
    const {dir,setDir} = useContext(Context);
    const [open,setOpen] = useState(true);
    const [files,setFiles] = useState([]);
    const [uploadIndex,setUploadIndex] = useState(0);
    const [uploading,setUploading] = useState(false);
    const [progress,setProgress] = useState(0);

    const choose = (event) => {
        let input = document.createElement("input");
        input.type = 'file';
        input.multiple = 'multiple'

        input.addEventListener('change', event=>{
            let fs = [];
            for(let f of input.files){
                fs.push(f);
            }
            setFiles(fs);
        });

        input.click();
    }

    const upload = (event) => {
        //do nothing
        setUploading(true);

        let uIndex = 0;

        let doJob = () => {
            if(uIndex < files.length){
                setProgress(0)
                let formdata = new FormData();
                formdata.append("dir", dir);
                formdata.append("upload_file", files[uIndex]);

                var ajax = new XMLHttpRequest();

                var completeHandler = function(event) {
                    var response = event.target.responseText;
                    Toast(response);
                    uIndex += 1;
                    doJob()
                }
                
                var progressHandler = function(event) {
                    setProgress(Math.ceil((event.loaded / event.total)*100));
                }
                
                ajax.upload.addEventListener("progress", progressHandler, false);
                ajax.addEventListener("load", completeHandler, false);
                //ajax.addEventListener("error", errorHandler, false);
                //ajax.addEventListener("abort", abortHandler, false);
                ajax.open("POST", "api/");
                ajax.send(formdata);
            }
            else{
                Toast("finished");
                setOpen(false);
            }
        }

        doJob();
    }

    const fileSize = (bytes) =>{
        if (bytes / (1024*1024) > 0){
            return (bytes / (1024*1024)).toFixed(2)+"Mb"
        }
        return (bytes / 1024).toFixed(2)+"kb"
    }

    useEffect(()=>{
        if(props.onClose != undefined && !open){
            props.onClose();
        }
    }, [open])

    return (
        <>
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <div className="w3-padding" style={{width:"400px"}}>
                    <font className="block w3-large">Upload files</font>
                    <i>Current Dir: {dir}</i>

                    {files.length > 0 && <>
                        <ul className="list-group">
                            {files.map((row,index)=>(
                                <li key={index} className="list-group-item hover:bg-purple-200 pointer clearfix">
                                    {row.name} - {fileSize(row.size)}

                                    <i onClick={e=>{
                                        setFiles(files.filter((r,i)=>i!=index))
                                    }} className="fa fa-times-circle text-lg float-right"/>
                                </li>
                            ))}
                        </ul>

                        {uploading ? <>
                            <div className="progress mt-3" style={{height:"10px"}}>
                                <div className="progress-bar" style={{width:progress+"%", height:"10px"}}></div>
                            </div>
                        </>
                        :<Button variant="contained" fullWidth sx={{my:2}} onClick={upload}>Upload</Button>}
                    </>}

                    {(!uploading) && <Button fullWidth sx={{my:2}} onClick={choose}>Choose Files</Button>}

                    <BottomClose onClose={()=>setOpen(false)}/>
                </div>
            </Dialog>
        </>
    )
}

function CloseHeading(props){
    return (
        <>
            <div className={"clearfix "+(props.className != undefined ? props.className : "")}>
                <font className="w3-large">{props.label}</font>

                <span className="bg-gray-200 w3-round-large bcenter float-right pointer hover:bg-gray-300" onClick={e=>{
                    if(props.onClose != undefined){
                        props.onClose(e);
                    }
                }} style={{height:"36px",width:"36px"}}>
                    <i className="fa fa-times text-lg"/>
                </span>
            </div>
        </>
    )
}

function BottomClose(props){
    return (
        <>
            <div className={"clearfix "+(props.className != undefined ? props.className : "")}>
                <Button variant="contained" color="error" className="float-right" onClick={e=>{
                    if(props.onClose != undefined){
                        props.onClose(e);
                    }
                }} style={{textTransform:"none"}}>
                    Close
                </Button>
            </div>
        </>
    )
}

function Warning(props){
    const [open,setOpen] = useState(true);

    useEffect(()=>{
        if(!open){
            if(props.onClose!= undefined){
                props.onClose();
            }
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={()=>{
            setOpen(false)
            if(props.onClose!= undefined){
                props.onClose();
            }
        }}>
            <div className="w3-padding-large" style={{width:"300px"}}>
                {props.title != undefined && <font className="w3-large block mb-30 block">{props.title}</font>}

                {props.secondaryText != undefined && <font className="block mb-15">{props.secondaryText}</font>}

                {props.view != undefined && <div className="py-2">{props.view}</div>}
                
                <div className="py-2 clearfix">
                    <Button variant="contained" color="error" className="w3-round-xxlarge" sx={{textTransform:"none"}} onClick={event=>{
                        setOpen(false)
                        if(props.onClose!= undefined){
                            props.onClose();
                        }
                    }}>Close</Button>
                    <span className="float-right">
                        
                        {props.action != undefined && <Button sx={{textTransform:"none"}} className="w3-round-xxlarge" variant="contained" onClick={event=>{
                            //setLogout(false);
                            props.action.callback();
                        }}>{props.action.text}</Button>}
                    </span>
                </div>
            </div>
        </Dialog>
    )
}