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
          required: true,
          props: {},
        },
        {
          name: 'description',
          key: 'description',
          type: 'text',
          label: 'Description',
          placeholder: 'Enter item description',
          required: true,
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
          type: 'numeric',
          label: 'Price',
          placeholder: 'Enter price per day',
          required: true,
          props: {
            keyboardType: 'numeric',
          },
        },
        {
          name: 'category',
          key: 'category',
          type: 'select',
          label: 'Category',
          placeholder: 'Select category',
          required: true,
          options: [
            'Electronics',
            'Furniture',
            'Sports',
            'Books',
            'Others',
          ],
          props: {},
        },
      ],
    },
    {
      id: 'period',
      title: 'Rental Period',
      fields: [
        {
          name: 'minimumPeriod',
          key: 'minimumPeriod',
          type: 'numeric',
          min: 1,
          label: 'Minimum Period',
          placeholder: 'Enter minimum days',
          required: true,
        },
        {
          name: 'maximumPeriod',
          key: 'maximumPeriod',
          type: 'numeric',
          min: 1,
          max: 365,
          label: 'Maximum Period',
          placeholder: 'Enter maximum days',
          required: true,
        },
      ],
    },
    {
      id: 'media',
      title: 'Media',
      required: true,
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