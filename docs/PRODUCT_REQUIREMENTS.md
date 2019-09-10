## User Stories

### As a sales consultant, I want to place an order for a customer
Sales consultant needs to be able to create orders in the system with all required fields.

### As a sales consultant, I want to find an order that I've previously placed for a customer
What is the best way for the sales consultant to find previous orders:
- search by address / phone number / customer id

### As a sales consultant, I want to edit an order that I've previously placed for a customer.
Edit of an order can potentially happen in a couple of scenarios
- Right after an order has been placed (edge case scenario, only happens if there was a mistake while creating the order)
- Customer calls with new / updated information / changes (search by phone number)
- Company has to move an order from on day to another (search by date)

### As a sales consultant, I want to delete an order I've previously placed for a customer
It we don't know better, it's often a good idea to keep history of orders, thus instead of deleting an order, we could have a status field with the state of the order:
- DELETED (if customer rep deletes the order, this could be extended to a multitude of reasons why order has not been completed, but we keep DELETED for now)
- COMPLETED (when order has been completed, could be useful for billing, but depends how they handle that)
- NEW (default status when creating a new order)
Adding the above flows introduces a new user story, where sales rep has to update status when order has been completed. Until clarified to customer, or new feature request comes in, we add the status field, make NEW default, set deleted orders to DELETED, also hide DELETED orders from search, don't do anything with the COMPLETED status and we do not show the status of each order. 

## Data Models
### Order
 - customer: References customer who needs work
 - services: One or mory services customer ordered (possibly make it a list of String instead)
 - notes: Notes from moving company
 - datetime: Time order should be completed
 - Address from
 - Address to

### Services
 - name: Moving | Packing | Cleaning

### Customer
 - Name
 - Phone number
 - Email

### Questions
- Packing happens at the from address
- Moving happens at the from address to the to address
- Cleaning happens at the from address, but could also happen at the to address
- Unpacking could also be a service provided at the to address (if it's not already included in the Packing service)
- If they want to change / add services, they need a place to do that, with the current application, they require a developer to do these changes

### Notes
- Address from / to seems to belong more to an order than a customer since its required to know for each service. If we want to have the customers address, it should be the to address, basically where the customer is going to live.

### API

#### Create Order
- list of services
- notes
- datetime
- address from
- address to
- customer
  - name
  - phone number
  - email

#### Update Order
- order id
- list of services
- notes
- datetime
- address from
- address to

Could potentially also change customer, but that can also be solved by creating a new order and deleting the current.

#### Delete Order
- order id

#### Search Order
Should be able to search on multiple fields, possible solutions:
- Search by text in multiple fields
- Search by field type in specific field

Searching by text over multiple fields is easy to extend to include or exclude other fields, though have to be careful in cases where the query can match in multiple fields and create confusion (where fields have similar values and / or if we allow prefix search) (this type of search should not per default include everything)
Search by field type for given field requires us to implement each searchable field in the UI with validation so we only allow specific values depending on field type (date, string, services etc) both on frontend and backend (though this type of search could be fully exposed in backend by framework, then it's up to the frontend to implement new fields to search on)

