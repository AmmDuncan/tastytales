const modalSrc = document.querySelector('.modal')
const modalCard = document.querySelector('.modal .card')
const offerBtns = document.querySelectorAll('.offer-card .btn')

modalSrc.addEventListener('click', function(e) {
    if(e.target === modalSrc) {
        modalSrc.classList.remove('open')
    }
})

modalCard.addEventListener('click', function (e) {
    if(e.target.classList.contains('close')) {
        modalSrc.classList.remove('open')
    }
})

let INDEX = 0;

function openModal(e){
    modalSrc.classList.add('open');
    let index = parseInt(e.target.dataset.index)
    callSetOrder(index)
    e.preventDefault();
}

function callSetOrder(index) {
    this.setOrder(index)
}

offerBtns.forEach(btn=>{
    btn.addEventListener('click', openModal)
})

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: cakes[INDEX],
            active: cakes[INDEX].common,
        }
        window.callSetOrder = window.callSetOrder.bind(this)
    }

    changeSize = (size) => {
        this.setState(({order, active})=>{
            return {
                order,
                active: parseInt(size),
            }
        })
    }

    setOrder = (ind) => {
        this.setState(({order, active}) => ({
           order: cakes[ind],
           active: cakes[ind].common,
        }))
    }

    render() {
        let children = this.state.order.sizes.map((size) => (
            <SizeCard key={size}
                      size={size}
                      active={size === this.state.active}
                      changeActive={this.changeSize}
            />
        ));

        let {order, active} = this.state
        let key = active.toString()
        let price = parseFloat(order.prices[key])
        price=price.toFixed(2)

        return (
            <>
                <h2>Order - {this.state.order.name}</h2>
                <div className="price">
                    GH¢{price}
                    <div className="small">*<strong>Not</strong> including delivery</div>
                </div>

                <SizeCardContainer>
                    {children}
                </SizeCardContainer>

                <UserForm />

                <div className="close">
                    <img src="img/close.svg" alt="close"/>
                </div>

            </>
        )
    }
}

class SizeCardContainer extends React.Component{

    render() {
        return (
            <div className="size-cards">
                {this.props.children}
            </div>
        )
    }
}

class SizeCard extends React.Component{
    changeActive = (e) => {
        this.props.changeActive(e.target.dataset.size)
    }

    render() {
        let {size, active} = this.props
        return (
            <div className={`size-card ${active ? "active" : ""}`}
                 data-size={size}
                 onClick={this.changeActive}
            >
                {this.props.size}
                <span className="small">Inch</span>
            </div>
        )
    }
}

class UserForm extends React.Component {
    state = {
        fields: {
            name: "",
            whatsapp: "",
            instagram: ""
        },
        fieldErrors: {
            name: "",
            whatsapp: "",
            instagram: "",
        },
        error: ""
    }

    onInputChange = (e) => {
        let fields = {...this.state.fields}
        fields[e.target.name] = e.target.value

        this.setState({
            fields
        })
    }

    validateWholeForm = () => {
        let {name, whatsapp, instagram} = this.state.fields
        let error = "Provide either your whatsapp number or instagram handle"
        if (!whatsapp && !instagram) {
            this.setState({
                fields: {
                    name,
                    whatsapp,
                    instagram,
                },
                error,
            })
        } else {
            error = ""
            this.setState({
                fields: {
                    name,
                    whatsapp,
                    instagram,
                },
                error,
            })
        }
    }

    validateWhatsAppContact = () => {
        let {whatsapp, instagram} = this.state.fields

        if (whatsapp && !instagram) {
            if(!validatePhone(whatsapp)) {
                this.setState(({fields, fieldErrors, error}) => {
                    return {
                        fields,
                        fieldErrors:
                          Object.assign(
                            {},
                            fieldErrors,
                            {whatsapp: "Invalid phone number"})
                    }
                })
            } else {
                this.setState(({fields, fieldErrors, error}) => {
                    return {
                        fields,
                        fieldErrors:
                          Object.assign(
                            {},
                            fieldErrors,
                            {whatsapp: ""})
                    }
                })
            }
        }
    }

    validateName = () => {
       let {name} = this.state.fields

        if (!name) {
            this.setState(({fields, fieldErrors, error}) => {
                return {
                    fields,
                    fieldErrors:
                      Object.assign(
                        {},
                        fieldErrors,
                        {name: "Name cannot be empty"})
                }
            })
        } else {
            this.setState(({fields, fieldErrors, error}) => {
                return {
                    fields,
                    fieldErrors:
                      Object.assign(
                        {},
                        fieldErrors,
                        {name: ""})
                }
            })
        }
    }

    onFormSubmit = (e) => {
        e.preventDefault()
        this.validateWholeForm()
        this.validateWhatsAppContact()
        this.validateName()
    }

    render() {
        return (
          <form className="row" onSubmit={this.onFormSubmit}>
              <div className="d-flex align-items-center">
                  <label htmlFor="name" className="d-flex">Name: <span className="color-red">*</span></label>
                  <input type="text"
                         placeholder="John"
                         name="name"
                         id="name"
                         className="form-control form-control-sm"
                         onChange={this.onInputChange}/>
              </div>
              <div className="small color-red mt-1">{this.state.fieldErrors.name}</div>
              <div className="d-flex align-items-center mt-1">
                  <label htmlFor="whatsapp">WhatsApp:</label>
                  <input type="text"
                         placeholder="02XXXXXXXX"
                         name="whatsapp"
                         id="whatsapp"
                         className="form-control form-control-sm"
                         onChange={this.onInputChange}/>
              </div>
              <div className="small color-red mt-1">{this.state.fieldErrors.whatsapp}</div>
              <div className="d-flex align-items-center mt-1">
                  <label htmlFor="instagram">Instagram: </label>
                  <input type="text"
                         placeholder="@yourhandle"
                         name="instagram"
                         id="instagram"
                         className="form-control form-control-sm"
                         onChange={this.onInputChange}/>
              </div>
              <div className="small color-red">{this.state.error}</div>
              
              <div className="d-flex align-items-center justify-content-center mt-3 mb-0">
                  <input type="submit"
                         value="Place Order"
                         className="btn btn-dark form-control"/>
              </div>
          </form>
        )
    }
}


ReactDOM.render(<Root />, document.querySelector(".modal .card"))