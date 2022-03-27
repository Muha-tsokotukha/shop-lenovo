function onSubmit(form, e){
    e.preventDefault();
    axios.put("/api/products", {
        _id: form.elements._id.value,
        title: form.elements.title.value,
        description: form.elements.description.value,
        price: form.elements.price.value
    }).then( res => {
        location.replace("/");
    } )
}