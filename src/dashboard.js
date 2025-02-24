import React from "react";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            payment: [], 
            checkedBoxes: [] 
        };
        this.headers =[
            { key: 'id', label: 'Id' },
            { key: 'order_id', label: 'Order_Id' },
            { key: 'payment_id', label: 'Payment_Id' },
            { key: 'message', label: 'Message' },
            { key: 'status', label: 'Status' },
            { key: 'switch', label: 'Switch' }
        ];
        this.deleteEmployees = this.deleteEmployees.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
    }

    deleteEmployees(event) {
        event.preventDefault();
        if (window.confirm('Are you sure, want to delete the selected id?')) {
            alert(this.state.checkedBoxes.join(", ") + " Successfully Deleted");
        }
    }

    toggleCheckbox(e, item) {
        const checkedBoxes = [...this.state.checkedBoxes];
        if (e.target.checked) {
            checkedBoxes.push(item.id);
        } else {
            const index = checkedBoxes.indexOf(item.id);
            if (index > -1) {
                checkedBoxes.splice(index, 1);
            }
        }
        this.setState({ checkedBoxes });
    }

    componentDidMount() {
        fetch('http://localhost/react.js/payment.php')
            .then(response => response.json())
            .then(result => {
                this.setState({ payment: result });
           })
            .catch(err => {
                console.log("Error Reading data " + err);
        });
    }

    render() {
        const { payment, checkedBoxes } = this.state;
        const idfound = payment && payment.length;
        return (
            <div className="container">
                <div id="msg"></div>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            {this.headers.map(h => (
                                <th key={h.key}>{h.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {idfound ? (
                            payment.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="selectsingle" 
                                            checked={checkedBoxes.includes(item.id)}
                                            onChange={(e) => this.toggleCheckbox(e, item)} 
                                        />
                                        {item.id}
                                    </td>
                                    <td>{item.order_id}</td>
                                    <td>{item.payment_id}</td>
                                    <td>{item.message}</td>
                                    <td>{item.status}</td>
                                    <td>{item.switch}</td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan={this.headers.length}>No product found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Dashboard;
