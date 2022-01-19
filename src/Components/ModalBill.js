import React from 'react';
import Modal from 'react-modal';

const styles = {
  content: {
    top: '5%',
    botton: 'auto',
    left: '50%',
    right: '50%',
    marginRight: '-40%',
    transform: 'translate(-50%, 0%)'
  }
}

Modal.setAppElement('#root');

let subtitle;

class ModalService extends React.Component {
  constructor(props) {
    super(props);
    const { bill } = props;
    this.state = {
      modalIsOpen: false,
      name: bill ? bill.name : '',
      payDay: bill ? bill.payDay : '',
      errorMessage: null,
      showMonths: bill && bill.months,
      bill: bill
    }
  }

  componentDidMount() {
    this.setState({
      modalIsOpen: true
    });
  }
  openModal = () => {
    this.setState({
      modalIsOpen: true
    });
  }

  afterOpenModal = () => {
    subtitle.style.color = 'black';
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    })
    this.props.onCloseModal(false);
  }

  handlerSubmit = (e) => {
    e.preventDefault();
    this.setState({
      modalIsOpen: false,
      errorMessage: null,
      bill: this.props.bill
    });
    this.props.onSubmitModal(this.state);
  }

  handlerChange = (e) => {
    if (this.state.bill) {
      
    const billUpdate = Object.assign({}, this.state.bill);
    this.props.bill.name = e.target.name === 'name' ? e.target.value : billUpdate.name;
    this.props.bill.payDay = e.target.name === 'payDay' ? Number.parseInt(e.target.value) : billUpdate.payDay;
    };
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handlerClick = (e) => {
    e.preventDefault();
    const month = this.props.bill.months.find(month => month.name === e.target.value);
    month.isPaid = !month.isPaid;
    this.setState({
      showMonths: true
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={styles}
        contentLabel="Bill Modal"
      >
        <div className='row'>
          <h2 className='col' ref={(_subtitle) => (subtitle = _subtitle)}>
            {this.state.showMonths ? 'Actualizar' : 'Agregar'}
          </h2>
          <button onClick={this.closeModal} className='col-2 mx-4 btn btn-info'>Cerrar</button>
        </div>
        <h3>Servicio</h3>
        <form onSubmit={this.handlerSubmit} className='form-group'>
          <label htmlFor='name'>Nombre del servicio</label>
          <input
            className='form-control mb-3'
            type='text'
            name='name'
            id='name'
            onChange={this.handlerChange}
            value={this.state.name}
          />
          <label htmlFor='payDay'>Dia de pago</label>
          <input
            className='form-control mb-3'
            type='text'
            name='payDay'
            id='payDay'
            onChange={this.handlerChange}
            value={this.state.payDay}
          />
          {
            this.state.showMonths &&
              <div>
                Seleccione el mes pago:
                <br />
                {
                  this.props.bill.months.map(month => {
                    return (
                      <button
                        key={month.name}
                        className={!month.isActive ? 'btn btn-light mx-1 my-1' : 
                                    month.isPaid ? 'btn btn-success mx-1 my-1' : 
                                                  'btn btn-dark mx-1 my-1'}
                        value={month.name}
                        onClick={this.handlerClick}
                        disabled={!month.isActive ? 'disabled' : ''}
                      >
                        {month.name}
                      </button>
                    )
                  })
                }
              </div>
          }
          <br />
          <button
            type='submit'
            className='btn btn-primary'>Guardar</button>
        </form>
        {
          this.state.errorMessage != null &&
          <div >
            {this.state.errorMessage}
          </div>
        }
      </Modal>
    )
  }
}

export default ModalService;