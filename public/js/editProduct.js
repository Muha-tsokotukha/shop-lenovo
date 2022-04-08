const nickname = localStorage.getItem('nickname');

function onSubmit(form, e){
    e.preventDefault();

    let sendData = new FormData();
    sendData.append("_id" , form.elements._id.value);
    sendData.append("title" , form.elements.title.value);
    sendData.append("description" , form.elements.description.value);
    sendData.append("price" , form.elements.price.value);
    sendData.append("image" , form.elements.image.files[0]);
    axios({
        url: "/api/products",
        method: "PUT",
        header: {
            "Content-type": "multipart/form-data"
        },
        data: sendData
    }).then((res)=>{
        location.replace("/profile/"+nickname);
    });
    
}