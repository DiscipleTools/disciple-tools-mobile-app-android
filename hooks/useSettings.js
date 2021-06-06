import usePostType from 'hooks/usePostType';
import useRequest from 'hooks/useRequest';

const useSettings = () => {
  const { postType } = usePostType();

  const mapSettings = (settings) => {
    let fieldList = {};
    // Get fieldlist
    Object.keys(settings.fields).forEach((fieldName) => {
      const fieldData = settings.fields[fieldName];
      // omit fields with { "hidden": true }
      if (
        !Object.prototype.hasOwnProperty.call(fieldData, 'hidden') ||
        (Object.prototype.hasOwnProperty.call(fieldData, 'hidden') && fieldData.hidden === false)
      ) {
        if (fieldData.type === 'key_select' || fieldData.type === 'multi_select') {
          let newFieldData = {
            name: fieldData.name,
            description: fieldData.name,
            values: fieldData.default,
          };
          if (Object.prototype.hasOwnProperty.call(fieldData, 'description')) {
            newFieldData = {
              ...newFieldData,
              description: fieldData.description,
            };
          }
          fieldList = {
            ...fieldList,
            [fieldName]: newFieldData,
          };
        } else {
          fieldList = {
            ...fieldList,
            [fieldName]: {
              name: fieldData.name,
            },
          };
        }
      }
    });
    // Get channels
    let channels = {};
    Object.keys(settings.channels).forEach((channelName) => {
      const channelData = settings.channels[channelName];
      channels = {
        ...channels,
        [channelName]: {
          label: channelData.label,
          value: channelName,
        },
      };
    });

    let tileList = [];
    if (Object.prototype.hasOwnProperty.call(settings, 'tiles')) {
      Object.keys(settings.tiles).forEach((tileName) => {
        let tileFields = [];
        Object.keys(settings.fields).forEach((fieldName) => {
          let fieldValue = settings.fields[fieldName];
          if (
            Object.prototype.hasOwnProperty.call(fieldValue, 'tile') &&
            fieldValue.tile === tileName
          ) {
            // Get only fields with hidden: false
            if (
              !Object.prototype.hasOwnProperty.call(fieldValue, 'hidden') ||
              (Object.prototype.hasOwnProperty.call(fieldValue, 'hidden') &&
                fieldValue.hidden === false)
            ) {
              let newField = {
                name: fieldName,
                label: fieldValue.name,
                type: fieldValue.type,
              };
              if (Object.prototype.hasOwnProperty.call(fieldValue, 'post_type')) {
                newField = {
                  ...newField,
                  post_type: fieldValue.post_type,
                };
              }
              if (Object.prototype.hasOwnProperty.call(fieldValue, 'default')) {
                newField = {
                  ...newField,
                  default: fieldValue.default,
                };
              }
              if (Object.prototype.hasOwnProperty.call(fieldValue, 'in_create_form')) {
                newField = {
                  ...newField,
                  in_create_form: fieldValue.in_create_form,
                };
              }
              if (Object.prototype.hasOwnProperty.call(fieldValue, 'required')) {
                newField = {
                  ...newField,
                  required: fieldValue.required,
                };
              }
              /*if (Object.prototype.hasOwnProperty.call(fieldValue, 'icon')) {
                newField = {
                  ...newField,
                  icon: fieldValue.icon,
                };
              }*/
              tileFields.push(newField);
            }
          }
        });
        let tileFieldsOrdered = [];
        if (settings.tiles[tileName].hasOwnProperty('order')) {
          const orderList = settings.tiles[tileName].order;
          let existingFields = [...orderList];
          let missingFields = [];
          tileFields.map((tileField, idx) => {
            const orderIdx = orderList.indexOf(tileField.name);
            if (orderIdx !== -1) {
              existingFields[orderIdx] = tileField;
            } else {
              missingFields.push(tileField);
            }
          });
          tileFieldsOrdered = [...existingFields, ...missingFields];
        } else {
          tileFieldsOrdered = [...tileFields];
        }
        // TODO: investigate why "location_grid_meta" was being added as string type
        tileFieldsOrdered = tileFieldsOrdered.filter((item) => typeof item === 'object');
        if (!settings.tiles[tileName].hidden) {
          tileList.push({
            name: tileName,
            label: settings.tiles[tileName].label,
            tile_priority: settings.tiles[tileName].tile_priority,
            fields: tileFieldsOrdered,
          });
        }
        tileList.sort((a, b) => a.tile_priority - b.tile_priority);
      });
    }
    return {
      fields: fieldList,
      channels,
      labelPlural: settings.label_plural,
      tiles: tileList,
    };
  };

  const url = `/dt-posts/v2/${postType}/settings`;
  const { data: settings, error, isLoading, isValidating } = useRequest(url);
  return {
    settings: settings?.fields ? mapSettings(settings) : null,
    error,
    isLoading,
    isValidating,
  };
};
export default useSettings;
