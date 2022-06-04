let vueJS
let ModaladdProd
const init = async () => {
    ModaladdProd = new bootstrap.Modal(document.getElementById('addProd'), {keyboard: false})
    const response = await fetch('https://eshop-deve.herokuapp.com/api/v2/orders', {
        method: 'GET',
        headers: {
            Authorization: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ'
        }
    })
    const ordenes = await response.json()
    vueJS = new Vue({
        el: "#page",
        data: {
            paginaActual:       "Listado",//"Detalle"
            isAlta:             false,
            ListadoOrdenes:     ordenes.orders,
            numOrdenes:         ordenes.orders.length,
            DetalleOrden:       "",
            formulario: {
                sku:            "",
                name:           "",
                quantity:       "",
                price:          "",
            },
            alerts: {
                isSku:            true,
                isName:           true,
                isQuantity:       true,
                isPrice:          true,
            }
        },
        methods: {
            IrADetalle: async function (data) {
                this.paginaActual = "Detalle"
                this.DetalleOrden = data
            },
            Pagar: async function () {
                Swal.fire(
                    'Proceso exitoso!',
                    '',
                    'success'
                  ).then((result) => {
                      this.paginaActual = "Listado"
                      this.DetalleOrden = ""
                  })
            },
            Agregar: async function () {
                this.isAlta = true
            },
            Regresar: async function () {
                this.paginaActual = "Listado"
                this.DetalleOrden = ""
            },
            Cancelar: async function () {
                this.formulario =  {
                    sku:            "",
                    name:           "",
                    quantity:       "",
                    price:          "",
                }
                this.alerts = {
                    isSku:            true,
                    isName:           true,
                    isQuantity:       true,
                    isPrice:          true,
                }
                $('#addProd').modal('hide')
                Swal.fire({
                    icon: 'error',
                    title: 'Producto no agregado',
                    text: '',
                  })
            },
            Aceptar: async function () {
                let rtn = false
                if(this.formulario.sku == ""){
                    this.alerts.isSku = false
                    rtn = true
                }else {
                    this.alerts.isSku = true
                }
                if(this.formulario.name == ""){
                    this.alerts.isName = false
                    rtn = true
                }else {
                    this.alerts.isName = true
                }
                if(this.formulario.quantity == ""){
                    this.alerts.isQuantity = false
                    rtn = true
                }else {
                    this.alerts.isQuantity = true
                }
                if(this.formulario.price == ""){
                    this.alerts.isPrice = false
                    rtn = true
                }else {
                    this.alerts.isPrice = true
                }
                if (rtn)return
                this.DetalleOrden.items.push(this.formulario)
                this.DetalleOrden.totals.subtotal = +this.DetalleOrden.totals.subtotal + (+this.formulario.price*+this.formulario.quantity)
                this.DetalleOrden.totals.total = +this.DetalleOrden.totals.total + (+this.formulario.price*+this.formulario.quantity)
                this.formulario = {
                    sku:            "",
                    name:           "",
                    quantity:       "",
                    price:          "",
                }
                this.alerts = {
                    isSku:            true,
                    isName:           true,
                    isQuantity:       true,
                    isPrice:          true,
                }
                $('#addProd').modal('hide')
                Swal.fire(
                    'Producto agregado',
                    '',
                    'success'
                  )
            },
        },
        watch: {
            'formulario.quantity': function (n,o) {
                if (n*1 < 0) {
                    this.formulario.quantity = 0
                    return 0
                }
            },
            'formulario.price': function (n,o) {
                if (n*1 < 0) {
                    this.formulario.price = 0
                    return 0
                }
            }
        }
    })
    $("#page").fadeIn()
}