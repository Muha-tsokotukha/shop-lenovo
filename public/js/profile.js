const prodsDiv = document.querySelector(".main-products__products");
function deleteProduct(id){
    axios.delete(`/api/products/${id}` ).then(res =>{
        getProducts();
    });
}

function getProducts(){
	axios.get(`/api/products`).then(res=>{
		showProducts(res.data);
    });
}

function showProducts(prods){
    let prodsHTML = ``;

    for(let i=0;i< prods.length; i++){
        prodsHTML += `
        <div class="main-products__product">
            <img src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS6z7pveUf3UYnwPKdwp_g90Ma-zZA2mG1-d3PEqh4p9am8rnHsQlOMGw88ndww69vSsMBTz6807w&usqp=CAc" alt="Product image">
            <p>${prods[i].title}</p>
            <p>${prods[i].description}</p>
            <p>${prods[i].price}</p>
            <ul class="main-products__editing">
                <a onclick="deleteProduct('${prods[i]._id}')" class="main-products__delete">&#10006;</a>    
                <a href="/editProduct?id=<%=product._id %>" class="main-products__edit">Edit</a>
            </ul> 
        </div>
        `;
    }
    if(prods.length===0 ){
        prodsHTML = "<h2> 0 products </h2>"
    }
	prodsDiv.innerHTML = prodsHTML;
}