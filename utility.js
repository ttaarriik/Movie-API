const debounce = (func) => {
    let id;
    return (...args) => {
        if(id){
            clearInterval(id);
        }
        id = setTimeout(() => {
          func.apply(null, args);
        }, 1000);
    }
  
}