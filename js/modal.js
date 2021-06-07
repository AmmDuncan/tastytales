const modal = document.querySelector('.modal')
const modalCard = document.querySelector('.modal .card')
const offerBtns = document.querySelectorAll('.offer-card .btn')

modal.addEventListener('click', function(e) {
    if(e.target === modal) {
        modal.classList.remove('open')
    }
})

let INDEX = 0;

function openModal(e){
    modal.classList.add('open');
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
        let price = order.prices[key]

        return (
            <>
                <h2>Order - {this.state.order.name}</h2>
                <div className="price">
                    GH¢{price}.00
                </div>
                <SizeCardContainer>
                    {children}
                </SizeCardContainer>
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

}


ReactDOM.render(<Root />, document.querySelector(".modal .card"))