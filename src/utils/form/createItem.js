export const createItemFormConfig = [
    {
      id: 'details',
      title: 'Item Details',
      fields: [
        {
          name: 'name',
          key: 'name',
          type: 'text',
          label: 'Item Name',
          placeholder: 'Enter item name',
          props: {},
        },
        {
          name: 'description',
          key: 'description',
          type: 'text',
          label: 'Description',
          placeholder: 'Enter item description',
          props: {
            multiline: true,
            numberOfLines: 4,
            style: {
                height: 120,
                textAlignVertical: 'top',
            },
          },
        },
        {
          name: 'price',
          key: 'price', 
          type: 'number',
          label: 'Price',
          placeholder: 'Enter price per day',
          props: {
            keyboardType: 'numeric',
          },
        },
      ],
    },
    {
      id: 'period',
      title: 'Rental Period',
      layout: 'row',
      fields: [
        {
          name: 'minimumPeriod',
          key: 'minimumPeriod',
          type: 'number',
          label: 'Minimum Period',
          placeholder: 'Enter minimum days',
          props: {
            keyboardType: 'numeric',
            style: {
                flex: 1,
                width: '50%',
            },
          },
        },
        {
          name: 'maximumPeriod',
          key: 'maximumPeriod',
          type: 'number',
          label: 'Maximum Period',
          placeholder: 'Enter maximum days',
          props: {
            keyboardType: 'numeric',
            style: {
                flex: 1,
                width: '50%',
            },
          },
        },
      ],
    },
    {
      id: 'images',
      title: 'Images',
      fields: [
        {
          type: 'media',
          name: 'images',
          key: 'images',
          label: 'Images',
          placeholder: 'Add images',
          props: {
            defaultValue: [],
          },
        },
      ],
    },
  ];