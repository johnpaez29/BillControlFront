import React, { useState } from 'react';
import ModalBill from './ModalBill';
import BillRepository from './BillRepository';
import '../CSS/StateBill.css';
import Logo from '../Images/Logo.PNG';

const UpdateBill = (props) => {
  const { bill, updateFinish, onCloseUpdate } = props;
  const [showModal, setShowModal] = useState(true);
  const [update, setUpdate] = useState(false);
  const [billToUpdate, setbillToUpdate] = useState(null);

  const handlerSubmit = (data) => {
    const billNew = data.bill;
    billNew.id = billNew.idService;
    billNew.payDay = billNew.payDay;
    setbillToUpdate(billNew);
    setUpdate(true);
  }

  const handlerCloseModal = (isClosed) => {
    setUpdate(false);
    setShowModal(isClosed);
    setbillToUpdate(null);
    onCloseUpdate();
  }

  const onLoadingData = (data) => {
    setUpdate(false);
    setShowModal(false);
    setbillToUpdate(null);
    alert(`Se ha actualizado el registro con exito: ${data.message}`);
    updateFinish();
  }

  return (
    <>
      {
        update &&
        <BillRepository
          loadingData={onLoadingData}
          action='updateOne'
          data={billToUpdate}
        />
      }
      {
        showModal &&
        <ModalBill
          onCloseModal={handlerCloseModal}
          onSubmitModal={handlerSubmit}
          bill={bill}
        />
      }
    </>
  )
}

class AddBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      publicService: '',
      dayService: 0,
      insertData: false
    }
  }

  handlerAdd = () => {
    this.setState({
      showModal: true
    });
  }

  handlerCloseModal = (state) => {
    this.setState({
      showModal: state
    });
  }

  handlerSubmit = (data) => {
    this.setState({
      publicService: data.name,
      dayService: parseInt(data.payDay),
      insertData: true
    });
  }

  onLoadingData = (data) => {
    this.setState({
      publicService: '',
      dayService: 0,
      insertData: false,
      showModal: false
    });
    alert(`Se ha creado un nuevo registro con exito: ${data.message}`);
    this.props.getData();
  }

  render() {
    return (
      <div className='mx-3'>
        {
          this.state.insertData &&
          <BillRepository
            loadingData={this.onLoadingData}
            action='insertOne'
            data={{ name: this.state.publicService, payDay: this.state.dayService }}
          />
        }
        <button className='btn btn-info my-1' onClick={this.handlerAdd}>Adicionar Servicio</button>
        {
          this.state.showModal &&
          <>
            <ModalBill
              onCloseModal={this.handlerCloseModal}
              onSubmitModal={this.handlerSubmit}
            />
          </>
        }
      </div>
    )
  }
}

class FilterBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: '',
      selectState: '',
      checkAll: false
    }
  }

  handlerChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      [e.target.name]: value
    });
    this.props.serviceFilter({ [e.target.name]: value });
  }

  render() {
    return (
      <div>
        <div>
          <h4 className='mt-2'>Servicio a consultar: </h4>
        </div>
        <div>
          <div className='row mb-3'>
            <select
              className='col form-select form-select-sm mx-5'
              disabled={this.state.checkAll ? 'disabled' : ''}
              name='selectValue'
              onChange={this.handlerChange}>
              <option key='' value=''>Seleccione el nombre ...</option>
              {
                this.props.serviceList.map(service => {
                  return (
                    <option
                      key={service.idService}
                      value={service.idService}>
                      {service.name}
                    </option>
                  )
                })
              }
            </select>
            <select
              className='col form-select form-select-sm mx-5'
              disabled={this.state.checkAll ? 'disabled' : ''}
              name='selectState'
              onChange={this.handlerChange}>
              <option>Seleccione el estado ...</option>
              {
                [...new Set(this.props.serviceList.map(service => service.state))].map(service => {
                  return (
                    <option
                      key={service}
                      value={service}
                    >
                      {service}
                    </option>
                  )
                })
              }
            </select>
          </div>
          <div>
            <input
              type='checkbox'
              name='checkAll'
              onChange={this.handlerChange}
              className='mx-2'
            />
            Mostrar todos los servicios activos.
          </div>
        </div>
        <hr />
      </div>
    )
  }
}


class ListBill extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deleteOne: false,
      idBill: '',
      updateBill: false,

    };
  }

  deleteBill = (e) => {
    this.setState({
      deleteOne: true,
      idBill: e.target.value
    });
  }
  onLoadingData = (data) => {
    this.setState({
      deleteOne: false
    });
    alert(`Se ha eliminado un nuevo registro con exito: ${data.message}`);
    this.props.getData();
  }

  viewDetail = (e) => {
    this.setState({
      updateBill: true,
      idBill: e.target.value
    });
  }

  onUpdateFinish = () => {
    this.setState({
      updateBill: false
    });
    this.props.getData();
  }

  closeUpdate = () => {
    this.setState({
      updateBill: false
    });
  }

  render() {
    return (
      <div className='mx-5'>
        {
          this.state.deleteOne &&
          <BillRepository
            loadingData={this.onLoadingData}
            action='deleteOne'
            data={this.state.idBill}
          />
        }

        {
          this.state.updateBill &&
          <UpdateBill
            onCloseUpdate={this.closeUpdate}
            bill={this.props.serviceList.find(bill => bill.idService === this.state.idBill)}
            updateFinish={this.onUpdateFinish}
          />
        }
        <table className='table'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Servicio</th>
              <th scope='col'>Fecha de pago</th>
              <th scope='col'>Estado</th>
              <th scope='col'>Registrar pago</th>
              <th scope='col'>Eliminar Servicio</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.serviceList.map(service => {
                return (
                  <tr key={service.idService} className={service.state === 'ATRASADO' ? 'table-danger' : ''}>
                    <th scope='row'>{service.name}</th>
                    <td>{service.payDay}</td>
                    <td>{service.state}</td>
                    <td><button
                      className='btn btn-outline-info btn-block btn-eye'
                      value={service.idService}
                      onClick={this.viewDetail}
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button></td>
                    <td><button
                      className='btn btn-outline-danger btn-block'
                      value={service.idService}
                      onClick={this.deleteBill}
                    >Eliminar</button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

const TopBar = () => {
  return (
    <div className='navbar navbar-light row' style={{ backgroundColor: 'lightblue' }}>
      <div>
        <img src={Logo} className='logo' alt='logo' />
        <h1 className='col-11 mr-8 mt-5'>Valida tus servicios</h1>
      </div>

    </div>
  )
}

class BillBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: '',
      checkAll: false,
      selectState: '',
      listBill: [],
      getData: true,
      enableSpinner: true
    }
  }

  onLoadingData = (data) => {
    this.setState({
      enableSpinner: false,
      listBill: data.map(bill => {
        return ({
          name: bill.name,
          idService: bill.id,
          months: bill.months,
          payDay: bill.payDay,
          state: bill.state
        })
      }),
      getData: false
    });
  }

  handlerFilter = (filterService) => {
    const nameFilter = Object.keys(filterService)[0];
    this.setState({
      [nameFilter]: Object.values(filterService)[0]
    });
  }

  onGetData = () => {
    this.setState({
      getData: true
    });
  }

  onDeleteBill = (idBill) => {
    this.setState({
      idBill: idBill,
      deleteOne: true
    });
  }
  render() {
    console.log(this.state.selectValue, this.state.selectState);
    const serviceListFiltered = this.state.listBill
      .filter(service => {
        return this.state.checkAll || 
                (this.state.selectValue || this.state.selectState) &&
                (this.state.selectValue === '' || service.idService === this.state.selectValue) &&
                (this.state.selectState === '' || service.state === this.state.selectState)
      });
    return (
      <>  
        <div className='row'>
          {
            this.state.getData &&
            <BillRepository
              loadingData={this.onLoadingData}
              action='getAll'
            />
          }
          <div className='col'>
            <div>
              <FilterBill serviceList={this.state.listBill} serviceFilter={this.handlerFilter} />
            </div>
            <div>
              <AddBill
                getData={this.onGetData} />
            </div>
          </div>
        </div>

        {
          Array.isArray(serviceListFiltered) && serviceListFiltered.some(service => { return true }) &&
          <ListBill
            serviceList={serviceListFiltered}
            deleteBill={this.onDeleteBill}
            getData={this.onGetData}
          />
        }
      </>
    )
  }
}
class StateBill extends React.Component {

  render() {
    return (
      <div>
        <div>
          <TopBar />
        </div>
        <div>
          <BillBody />
        </div>
      </div>
    )
  }
}

export default StateBill;