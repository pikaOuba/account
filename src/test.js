// 请求4PX接口
post() {      
    api.$post('/order_imgApi', 
    {
      data: {"request_no":""} 
    }, (d) => {
      console.log(d)
    },(e) => {
      console.error(e)
    } )
}

// 请求DHL接口
post() {      
    api.$post('/order_getToken', 
    { }, (d) => {
      console.log(d)
    },(e) => {
      console.error(e)
    } )
}

post() {      
    api.$post('/order_getLabel', 
    {
         data: {
            "labelRequest":{
                "hdr":{
                    "accessToken":"8be31183a39b45e6b6a26ce3387007e1",
                    "messageDateTime":"2017-03-27T15:28:15+08:00",
                    "messageLanguage":"zh_CN",
                    "messageType":"LABEL",
                    "messageVersion":"1.4"
                },
                "bd":{
                    "pickupAccountId":"5999999201",
                    "soldToAccountId":"5999999201",
                    "pickupDateTime":"2017-03-27T15:28:15+08:00",
                    "pickupAddress":{
                        "address1":"Pickupaddress1",
                        "address2":"Pickupaddress2",
                        "address3":"Pickupaddress3",
                        "city":"PickupCity",
                        "companyName":"Pickupcompanyname",
                        "country":"CN",
                        "district":"Pickupdistrict",
                        "email":"pickup@email.com",
                        "name":"pickupname",
                        "phone":"13590205306",
                        "postCode":"518109",
                        "state":"pickupstate"
                    },
                    "shipperAddress":{
                        "address1":"shipperaddress1",
                        "address2":"shipperaddress2",
                        "address3":"shipperaddress3",
                        "city":"shipperCity",
                        "companyName":"shippercompanyname",
                        "country":"CN",
                        "district":"shipperdistrict",
                        "email":"shipper@email.com",
                        "name":"shippername",
                        "phone":"13590205306",
                        "postCode":"518109",
                        "state":"shipperstate"
                    },
                    "shipmentItems":[
                        {
                            "consigneeAddress":{
                                "idNumber":null,
                                "idType":null,
                                "address1":"consigneeaddress1",
                                "address2":"consigneeaddress2",
                                "address3":"consigneeaddress3",
                                "city":"consigneecity",
                                "companyName":"consigneecompanyname",
                                "country":"DE",
                                "district":"consigneedistrick",
                                "email":"consignee@email.com",
                                "name":"consigneename",
                                "phone":"1234567890",
                                "postCode":"627008",
                                "state":"ConsigneeState"
                            },
                            "returnAddress":{
                                "address1":"Returnaddress1",
                                "address2":"Returnaddress2",
                                "address3":"Returnaddress3",
                                "city":"ReturnCity",
                                "companyName":"Returncompanyname",
                                "country":"CN",
                                "district":"Returndistrict",
                                "email":"Return@email.com",
                                "name":"Returnname",
                                "phone":"13590205306",
                                "postCode":"518109",
                                "state":"Returnstate"
                            },
                            "shipmentID":"",
                            "deliveryConfirmationNo":null,
                            "packageDesc":"ShipmentDescription",
                            "totalWeight":660,
                            "totalWeightUOM":"G",
                            "codValue":0,
                            "contentIndicator":"00",
                            "totalValue":10,
                            "currency":"USD",
                            "customerReference1":"customerReference1",
                            "customerReference2":"customerReference2",
                            "freightCharge":0,
                            "height":null,
                            "length":null,
                            "width":null,
                            "dimensionUOM":"CM",
                            "incoterm":"DDU",
                            "insuranceValue":0,
                            "productCode":"PPS",
                            "remarks":"remarks",
                            "shipmentContents":[
                                {
                                    "contentIndicator":"00",
                                    "countryOfOrigin":"CN",
                                    "description":"contentdescription",
                                    "descriptionExport":"中文描述",
                                    "descriptionImport":"ENGdescription",
                                    "grossWeight":200,
                                    "weightUOM":"G",
                                    "hsCode":null,
                                    "itemQuantity":1,
                                    "itemValue":10,
                                    "skuNumber":"SKU12345"
                                }
                            ]
                        }
                    ],
                    "label":{
                        "format":"PNG",
                        "layout":"1x1",
                        "pageSize":"400x400"
                    }
                }
            }
        },
        labelUrl: "https://sandbox.dhlecommerce.asia/rest/v2/Label”
    }, (d) => {
      console.log(d)
    },(e) => {
      console.error(e)
    } )
}
   
// 请求顺丰接口
 api.$post('/order_sfLabelApi', 
    {
      orderid: ""
    }, (d) => {
      console.log(d)
    },(e) => {
      console.error(e)
    } )
  }



// 请求纵横接口
   api.$post('/order_getImg', 
    {
      data: 'paramsJson={"configInfo":{"lable_file_type":"2","lable_paper_type":"1","lable_content_type":"1","additional_info":{"lable_print_invoiceinfo":"Y","lable_print_buyerid":"N","lable_print_datetime":"Y","customsdeclaration_print_actualweight":"N"}},"listorder":[{"reference_no":""}]}',
      url: "http://order.globleexpress.com/webservice/PublicService.asmx/ServiceInterfaceUTF8"
    }, (d) => {
      console.log(d)
    },(e) => {
      console.error(e)
    } )
  }
