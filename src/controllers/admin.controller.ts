import { Request, Response } from "express";
import { Cuisine } from "../models/cuisine.model.js";
import { City } from "../models/city.model.js";

const addCuisine = async (req: Request, res: Response) => {
  try {
    const { cuisineName } = req.body;
    if (cuisineName.trim() === "") {
      res.status(400).json({
        success: false,
        message: "cuisine name empty",
      });
      return;
    }
    // check if cuisinename already exists;
    const isCuisine = await Cuisine.findOne({
      cuisineName: cuisineName.trim().toLowerCase(),
    });
    if (isCuisine) {
      res.status(400).json({
        success: false,
        message: "cuisine already exists",
      });
      return;
    }
    const newCuisine = await Cuisine.create({
      cuisineName: cuisineName.trim().toLowerCase(),
    });
    res.status(201).json({
      success: true,
      message: "successfully added cuisine",
      newCuisine,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteCuisine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Cuisine.deleteOne({ _id: id });
    // check if cuisine is deleted
    const cuisine = await Cuisine.findOne({ _id: id });
    if (cuisine) {
      res.status(400).json({
        success: false,
        message: "cuisine was not deleted",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "successfully deleted cuisine",
    });
  } catch (error) {
    console.log(error);
  }
};

const editCuisine = async (req: Request, res: Response) => {
  try {
    const { newCuisineName, id } = req.body;
    if (newCuisineName.trim() === "") {
      res.status(400).json({
        success: false,
        message: "empty cuisine field error",
      });
      return;
    }

    // check if newCuisineName already exists
    const cuisine = await Cuisine.findOne({
      cuisineName: newCuisineName.trim().toLowerCase(),
    });
    if (cuisine) {
      res.status(400).json({
        success: false,
        message: "cuisine already exists",
      });
      return;
    }
    await Cuisine.updateOne(
      { _id: id },
      { $set: { cuisineName: newCuisineName.trim().toLowerCase() } }
    );
    const newCuisine = await Cuisine.findOne({ _id: id });
    res.status(200).json({
      success: true,
      newCuisine,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllCuisines = async (req: Request, res: Response) => {
  try {
    const cuisines = await Cuisine.find({});
    res.status(200).json({
      success: true,
      cuisines,
    });
  } catch (error) {
    console.log(error);
  }
};

const addCity = async (req: Request, res: Response) => {
  try {
    const { cityName }: { cityName: string } = req.body;
    if (cityName.trim() === "") {
      res.status(400).json({
        success: false,
        message: "please enter a city",
      });
      return;
    }
    // check if city already exists
    const isCity = await City.findOne({
      cityName: cityName.trim().toLowerCase(),
    });
    if (isCity) {
      res.status(400).json({
        success: false,
        message: "city already exists",
      });
      return;
    }
    const city = await City.create({ cityName: cityName.trim().toLowerCase() });
    res.status(201).json({
      success: true,
      city,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteCity = async (req:Request,res:Response) => {
    try {
        const {id} = req.params;
        await City.deleteOne({_id:id});
        const city = await City.findOne({_id:id});
        if(city) {
            res.status(400).json({
                "success":false,
                "message":"city was not deleted"
            })
            return;
        }
        res.status(200).json({
            "success":true,
            "message":"successfully deleted city"
        })
    } catch (error) {
        console.log(error);
    }
}

const editCity = async (req:Request,res:Response) => {
    try {
        const {newCityName,id}:{newCityName:string;id:string} = req.body;
        if(newCityName.trim()==="") {
            res.status(400).json({
                "success":false,
                "message":"new city name is empty"
            })
            return;
        }
    
        // check if newCityName already exists in bd
        const isNewCity = await City.findOne({cityName:newCityName.trim().toLowerCase()});
        if(isNewCity) {
            res.status(400).json({
                "success":false,
                "message":"city already exists"
            })
            return;
        }
        // update
        await City.updateOne({_id:id},{$set:{cityName:newCityName.trim().toLowerCase()}});
        const newCity = await City.findOne({_id:id});
        res.status(200).json({
            "success":true,
            newCity,
        })
    } catch (error) {
        console.log(error);
    }
}


const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.find({});
    res.status(200).json({
      success: true,
      cities,
    });
  } catch (error) {
    console.log(error);
  }
};

export { addCuisine, getAllCuisines, deleteCuisine, editCuisine, addCity,getAllCities,deleteCity,editCity};
