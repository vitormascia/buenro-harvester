import { Transform } from "class-transformer";
import {
	IsBoolean, IsIn, IsInt, IsOptional, IsPositive, IsString,
	Max, MaxLength, Min, MinLength,
} from "class-validator";

import { StayPriceSegment } from "./@types/stays.enums.js";

const allowedSortByColumns = [
	"city",
	"pricePerNight",
	"name",
	"country",
	"priceSegment",
];

export class QueryStaysDto {
	/* --- Full Text Search --- */
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly text?: string;

	/* --- Exact Filtering (Common & Discriminator Fields) --- */
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly name?: string;

	@MaxLength(150)
	@MinLength(1)
	@IsOptional()
	@IsString()
	public readonly city?: string;

	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly country?: string;

	// @IsEnum(StayPriceSegment)
	@IsIn(Object.values(StayPriceSegment))
	@IsString()
	@IsOptional()
	public readonly priceSegment?: "low" | "medium" | "high";

	@IsBoolean()
	@IsOptional()
	@Transform(({ value }: { value: any }): any => {
		if (value === "true" || value === "1") {
			return true;
		}

		if (value === "false" || value === "0") {
			return false;
		}

		return value;
	})
	public readonly isAvailable?: boolean;

	/* --- Numeric Range Filtering (PricePerNight) --- */
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly minPrice?: number;

	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly maxPrice?: number;

	/* --- Pagination and Sorting --- */
	@Min(0)
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly skip: number = 0;

	@Max(100)
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly limit: number = 25;

	@IsIn(allowedSortByColumns)
	@IsString()
	@IsOptional()
	public readonly sortBy?: string = "pricePerNight";

	@IsIn(["ASC", "DESC"])
	@IsString()
	@IsOptional()
	public readonly sortDirection?: "ASC" | "DESC" = "ASC";
}
