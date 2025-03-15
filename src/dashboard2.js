import React from "react";
import './dashboard.css';

class Dashboard2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payment: [],
            checkedBoxes: [],
            error: null,
        };
        this.headers = [
            { key: 'id', label: 'Id' },
            { key: 'user_id', label: 'User  Id' },
            { key: 'payment_status', label: 'Payment Status' },
            { key: 'device_status', label: 'Device Status' },
            { key: 'switch', label: 'Switch' },
        ];
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

    handleSwitch = async (item) => {
        const newStatus = item.device_status === 'online' ? 'offline' : 'online';
        const paymentStatus = newStatus === 'online' ? 'done' : 'pending';

        const updatedPayment = this.state.payment.map(paymentItem => {
            if (paymentItem.id === item.id) {
                return { ...paymentItem, device_status: newStatus, payment_status: paymentStatus };
            }
            return paymentItem;
        });
        this.setState({ payment: updatedPayment });

        try {
            const response = await fetch('http://localhost:5000/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: item.id,
                    device_status: newStatus,
                    payment_status: paymentStatus,
                }),
            });

            if (!response.ok) {
                this.setState(prevState => ({
                    payment: prevState.payment.map(paymentItem => {
                        if (paymentItem.id === item.id) {
                            return { ...paymentItem, device_status: item.device_status, payment_status: item.payment_status };
                        }
                        return paymentItem;
                    }),
                    error: 'Failed to update data. Please try again later.',
                }));
            }
        } catch (error) {
            this.setState(prevState => ({
                payment: prevState.payment.map(paymentItem => {
                    if (paymentItem.id === item.id) {
                        return { ...paymentItem, device_status: item.device_status, payment_status: item.payment_status };
                    }
                    return paymentItem;
                }),
                error: 'An error occurred. Please try again later.',
            }));
        }
    };

    componentDidMount() {
        fetch('http://localhost:5000/payment')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                this.setState({ payment: result });
            })
            .catch(err => {
                this.setState({ error: 'Failed to fetch data. Please try again later.' });
            });
    }

    render() {
        const { payment, checkedBoxes, error } = this.state;
        const idFound = payment && payment.length;

        return (
            <div className="container">
                {error && <div className="alert alert-danger">{error}</div>}

                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            {this.headers.map(h => (
                                <th key={h.key}>{h.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {idFound ? (
                            payment.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="selectsingle"
                                            checked={checkedBoxes.includes(item.id)}
                                            onChange={(e) => this.toggleCheckbox(e, item)}
                                        />
                                        {item.id}
                                    </td>
                                    <td>{item.user_id}</td>
                                    <td>{item.payment_status}</td>
                                    <td>{item.device_status}</td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={item.device_status === 'online'}
                                                onChange={() => this.handleSwitch(item)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={this.headers.length}>No status found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Dashboard2;